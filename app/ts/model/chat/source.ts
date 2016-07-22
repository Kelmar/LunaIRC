/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';

/* ===================================================================== */

export enum SourceType
{
    /**
     * Line is from LunaIRC itself.
     */
    System,

    /**
     * Line is from the user of LunaIRC
     */
    Self,

    /**
     * Line is from the (a) remote server
     */
    Server,

    /**
     * Line is from a remote user.
     */
    User
}

/* ===================================================================== */

export class Source
{
    public type: KnockoutObservable<SourceType>;
    public name: KnockoutObservable<string>;

    constructor()
    {
        this.type = ko.observable(SourceType.System);
        this.name = ko.observable("");
    }
}

/* ===================================================================== */
