/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';
import {Log} from "./logging";

export class Target
{
    public name: KnockoutObservable<string>;
    public lines: KnockoutObservableArray<string>;

    constructor(name: string)
    {   
        this.name = ko.observable(name);
        this.lines = ko.observableArray([]);
    }
}

export class User extends Target
{
}

export class Group extends Target
{
}

/* ===================================================================== */
