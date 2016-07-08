/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';
import {Log} from "./logging";

/* ===================================================================== */

export class TargetLine
{
    private m_when: Date;
    private m_message: string;

    public when: KnockoutComputed<Date>;
    public message: KnockoutComputed<string>;

    public constructor(message: string)
    {
        this.m_when = new Date();
        this.m_message = message;

        this.when = ko.computed({
            owner: this,
            read: () => { return this.m_when; }
        });

        this.message = ko.computed({
            owner: this,
            read: () => { return this.m_message; }
        });
    } 
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

    public addLine(message: string)
    {
        var tl = new TargetLine(message);
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
