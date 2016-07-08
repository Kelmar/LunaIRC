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

    private m_target: Target;

    constructor()
    {
        var self = this;

        this.commandLine = new CommandLine();

        this.commandLine.on("command", (e) => self.handleCommand(e.command));

        this.targets = ko.observableArray([]);

        this.width = ko.observable(window.innerWidth);
        this.height = ko.observable(window.innerHeight);

        window.addEventListener('resize', (e) => { self.onResize(e); })

        ko.applyBindings(this);

        this.m_target = new User("Bob");
        this.targets.unshift(this.m_target);

        this.updateSizeBindings();
    }

    private handleCommand(cmd: string): void
    {
        this.m_target.lines.unshift(cmd);
        Log.debug("COMMAND: " + cmd);
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
