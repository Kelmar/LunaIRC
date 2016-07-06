/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from "knockout";

import {Log} from "./logging";
import CommandLine from './cmd';
import {Target,User,Group} from './target';

/* ===================================================================== */

export class Application
{
    public commandLine: CommandLine;
    public targets: KnockoutObservableArray<Target>;

    public width: KnockoutObservable<number>;
    public height: KnockoutObservable<number>;

    constructor()
    {
        var self = this;

        this.commandLine = new CommandLine();
        this.targets = ko.observableArray([]);

        this.width = ko.observable(window.innerWidth);
        this.height = ko.observable(window.innerHeight);

        window.addEventListener('resize', (e) => { self.onResize(e); })

        ko.applyBindings(this);

        var t = new User("Bob");
        this.targets.unshift(t);

        this.updateSizeBindings();
    }

    private updateSizeBindings(): void
    {
        this.width(window.innerWidth);
        this.height(window.innerHeight);
    }

    private onResize(event: Event): boolean
    {
        this.updateSizeBindings();

        return true;
    }
}

/* ===================================================================== */
