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
}

export class User extends Target
{
}

export class Group extends Target
{
}

/* ===================================================================== */
