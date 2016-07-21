/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';

/* ===================================================================== */

export default class Source
{
    public type: KnockoutObservable<number>;
    public name: KnockoutObservable<string>;

    constructor()
    {
        this.type = ko.observable(0);
        this.name = ko.observable("");
    }
}

/* ===================================================================== */
