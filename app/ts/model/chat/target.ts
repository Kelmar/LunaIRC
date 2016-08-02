/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as url from "url";
import * as path from "path";
import * as https from "https";

import * as async from "async";
import * as ko from "knockout";

import {Source, SourceType} from "./source";

import {Log} from "../../logging";

/* ===================================================================== */

export abstract class TargetItem
{
    public typeName: KnockoutComputed<string>;

    public constructor(typeName: string)
    {
        this.typeName = ko.computed(() => { return typeName; });
    }
}

/* ===================================================================== */

export class TargetImageItem extends TargetItem
{
    public href: KnockoutComputed<string>;

    public constructor(href: string)
    {
        super("Image")
        this.href = ko.computed(() => { return href; });
    }
}

/* ===================================================================== */

export class TargetVideoItem extends TargetItem
{
    public id: KnockoutComputed<string>;
    public thumbnail: KnockoutComputed<string>;
    public title: KnockoutObservable<string>;
    public comment: KnockoutObservable<string>;
    public href: KnockoutComputed<string>;
    
    private m_id: string;
    private m_thumbnail: string;

    public constructor(id: string)
    {
        super("Video");

        this.id = ko.computed(() => { return id; });
        this.thumbnail = ko.computed(this.getThumbnail);
        this.href = ko.computed(this.getHref);
        this.title = ko.observable("");

        https.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`, this.parseJson);
    }

    private parseJson = (res): void =>
    {
        if ((res.statusCode >= 200) && (res.statusCode <= 299))
        {
            var buffer: string = "";

            res.on('data', chunk =>
            {
                buffer += chunk;
            });

            res.on('end', () =>
            {
                var data = JSON.parse(buffer);
                this.title(data.title);
            });
        }
    }

    private getThumbnail = (): string =>
    {
        var id: string = this.id();
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    private getHref = (): string =>
    {
        var id: string = this.id();
        return `https://www.youtube.com/watch?v=${id}`;
    }
}

/* ===================================================================== */

export class TargetLine
{
    private m_source: Source;
    private m_name: string;
    private m_when: Date;
    private m_message: string;
    private m_items: TargetItem[];

    /**
     * Reference to the originator of the line.
     */
    public source: KnockoutComputed<Source>;

    /**
     * Copy of the name when the line was sent.
     * 
     * This is so that when a user on IRC changes their nick, the line
     * itself will continue to show the name that they send that message as.
     */
    public name: KnockoutComputed<string>;

    /**
     * When the line was created.
     */
    public when: KnockoutComputed<Date>;

    /**
     * The message that was sent.
     */
    public message: KnockoutComputed<string>;

    /**
     * List of parsed URLs
     */
    public items: KnockoutComputed<TargetItem[]>;

    public constructor(source: Source, message: string)
    {
        this.m_source = source;
        this.m_name = source.name.peek();
        this.m_when = new Date();
        this.m_message = message;
        this.m_items = [];

        this.source = ko.computed(this.getSource);
        this.name = ko.computed(this.getName);
        this.when = ko.computed(this.getWhen);
        this.message = ko.computed(this.getMessage);
        this.items = ko.computed(this.getItems);

        // Scan for URLs in the background.
        async.parallel([this.scanUrls]);
    }

    /**
     * Hunts for possible URLs in the message string. 
     */
    private parsePossibleUrls(): string[]
    {
        var message: string = this.m_message;
        var match: RegExpExecArray;

        var rval: string[] = [];
                
        for (;;) 
        {
            var pos: number = message.indexOf("http");

            if (pos == -1)
                break;

            // Possible match, check for http:// or https://

            var remain = message.substr(pos);

            if (remain.startsWith("http://") || remain.startsWith("https://"))
            {
                // Higher confidence....
                match = /[\s\t\v]/i.exec(remain);

                if (match == null)
                {
                    // Is to the end of the string
                    rval.push(remain);
                    break;
                }
                else
                {
                    rval.push(remain.substr(0, match.index - 1));
                    message = remain.substr(match.index);
                }
            }
            else
                message = remain.substr(4);
        }

        return rval;
    }

    /**
     * Constructs a detailed item for the message.
     */
    private buildItem(uri: url.Url): TargetItem
    {
        var valueNames = Object.keys(uri.query);

        if ((uri.host == "www.youtube.com") && (uri.pathname == "/watch") && (valueNames.indexOf("v") != -1))
        {
            // Youtube video
            return new TargetVideoItem(uri.query.v);
        }
        else
        {
            // Allow images
            const allowedExt: string[] = [ ".jpg", ".gif", ".png" ];

            var ext = path.extname(uri.pathname);

            var idx = allowedExt.indexOf(ext);

            if (idx != -1)
                return new TargetImageItem(uri.href);
        }

        return null;
    }

    /**
     * Finds confirmed URLs in the message string.
     * 
     * This function takes possible matches from parsePossibleUrls()
     * and runs them through a stricter URL parser returning an array
     * Url objects.
     */
    private scanUrls = (): void => 
    {
        var possibleUrls: string[] = this.parsePossibleUrls();

        for (var idx in possibleUrls)
        {
            var possibility: string = possibleUrls[idx];

            try
            {
                var uri = url.parse(possibility, true);
                var item = this.buildItem(uri);

                if (item != null)
                    this.m_items.push(item);
            }
            catch (ex)
            {
                // Ignore, parse errors.
            }
        }

        this.items.notifySubscribers();
    }

    public getSource  = (): Source       => { return this.m_source;  }
    public getName    = (): string       => { return this.m_name;    }
    public getWhen    = (): Date         => { return this.m_when;    }
    public getMessage = (): string       => { return this.m_message; }
    public getItems   = (): TargetItem[] => { return this.m_items;   }
}

/* ===================================================================== */

export class Target
{
    public name: KnockoutObservable<string>;
    public lines: KnockoutObservableArray<TargetLine>;
    public count: KnockoutComputed<number>;

    constructor(name: string)
    {   
        this.name = ko.observable(name);
        this.lines = ko.observableArray([]);

        this.count = ko.computed({
            owner: this,
            read: () =>
            {
                var lineArray = this.lines();
                return lineArray.length;
            }
        });
    }

    public addLine(source: Source, message: string)
    {
        var tl = new TargetLine(source, message);
        this.lines.push(tl);
    }
}

export class User extends Target
{
}

export class Group extends Target
{
}

/* ===================================================================== */
