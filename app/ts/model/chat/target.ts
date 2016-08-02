/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as url from "url";

import * as async from "async";
import * as ko from "knockout";

import {Source, SourceType} from "./source";

import {Log} from "../../logging";

/* ===================================================================== */

export class TargetLine
{
    private m_source: Source;
    private m_name: string;
    private m_when: Date;
    private m_message: string;
    private m_urls: string[];

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
    public urls: KnockoutComputed<string[]>;

    public constructor(source: Source, message: string)
    {
        this.m_source = source;
        this.m_name = source.name.peek();
        this.m_when = new Date();
        this.m_message = message;
        this.m_urls = [];

        this.source = ko.computed(this.getSource);
        this.name = ko.computed(this.getName);
        this.when = ko.computed(this.getWhen);
        this.message = ko.computed(this.getMessage);
        this.urls = ko.computed(this.getUrls);

        // Scan for URLs in the background.
        async.asyncify(this.scanUrls);
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
     * Finds confirmed URLs in the message string.
     * 
     * This function takes possible matches from parsePossibleUrls()
     * and runs them through a stricter URL parser returning an array
     * Url objects.
     */
    private scanUrls = (): void => 
    {
        var possibleUrls: string[] = this.parsePossibleUrls();

        for (var possibility in possibleUrls)
        {
           try
           {
               var url = url.parse(possibility, true);
               this.m_urls.push(possibility);
           }
           catch (ex)
           {
               // Ignore, parse errors.
           }
        }

        this.urls.notifySubscribers();
    }

    public getSource  = (): Source   => { return this.m_source;  }
    public getName    = (): string   => { return this.m_name;    }
    public getWhen    = (): Date     => { return this.m_when;    }
    public getMessage = (): string   => { return this.m_message; }
    public getUrls    = (): string[] => { return this.m_urls;    }
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
