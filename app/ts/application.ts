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

    public currentTarget: KnockoutComputed<Target>;

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

        this.currentTarget = ko.computed({
            owner: this,
            read: () => { return this.m_target; }
        });

        this.m_target = new User("Bob");
        this.targets.push(this.m_target);

        this.targets.push(new User("Joe"));

        ko.applyBindings(this);
        this.updateSizeBindings();
    }

    public isCurrentTarget(target: Target): boolean
    {
        return (target == this.m_target);
    }

    private handleCommand(cmd: string): void
    {
        this.m_target.addLine(cmd);
        //Log.debug("COMMAND: " + cmd);
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
