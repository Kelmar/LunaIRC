/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

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

    public constructor(source: Source, message: string)
    {
        this.m_source = source;
        this.m_name = source.name.peek();
        this.m_when = new Date();
        this.m_message = message;

        this.source = ko.computed(this.getSource);
        this.name = ko.computed(this.getName);
        this.when = ko.computed(this.getWhen);
        this.message = ko.computed(this.getMessage);
    }

    public getSource  = (): Source => { return this.m_source;  }
    public getName    = (): string => { return this.m_name;    }
    public getWhen    = (): Date   => { return this.m_when;    }
    public getMessage = (): string => { return this.m_message; }
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
