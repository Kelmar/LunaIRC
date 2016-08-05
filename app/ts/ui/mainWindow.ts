/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from "knockout";

import {Log} from "../logging";
import CommandLine from "./cmd";

import {Source,SourceType} from "../model/chat/source";
import {Target,User,Group} from "../model/chat/target";

import Modal from "./modal";

import IRCConnection from "../irc/ircConnection";

/* ===================================================================== */

export class MainWindow
{
    public commandLine: CommandLine;

    public width: KnockoutObservable<number>;
    public height: KnockoutObservable<number>;

    public targets: KnockoutObservableArray<Target>;
    public currentTarget: KnockoutObservable<Target>;

    private m_conn: IRCConnection;

    constructor()
    {
        var self = this;

        this.commandLine = new CommandLine();

        this.commandLine.on("command", (e) => self.handleCommand(e.command));

        this.targets = ko.observableArray([]);

        this.width = ko.observable(window.innerWidth);
        this.height = ko.observable(window.innerHeight);

        window.addEventListener('resize', this.onResize);

        var t = new User("Bob");
        this.targets.push(t);

        this.currentTarget = ko.observable(t);

        this.targets.push(new User("Joe"));

        ko.applyBindings(this);
        this.updateSizeBindings();
    }

    public isCurrentTarget = (target: Target, peek: boolean = false): boolean =>
    {
        var t: Target;
        
        if (peek)
            t = this.currentTarget.peek();
        else
            t = this.currentTarget();

        return (target == t);
    }

    public selectTarget = (target: Target): boolean =>
    {
        this.currentTarget(target);
        return false;
    }

    public openSettingsDialog = (): boolean =>
    {
        var modal = new Modal("#dialog", "app/resources/settings.html");
        modal.show();

        return false;
    }

    public testDialogError = (): boolean =>
    {
        var modal = new Modal("#dialog", "bogus/resource/file.html");
        modal.show();

        return false;
    }

    public openConnectDialog = (): boolean =>
    {
        return false;
    }

    private handleCommand(cmd: string): void
    {
        var s = new Source()

        var t = this.currentTarget.peek();
        t.addLine(s, cmd);

        if (cmd == "/test")
            this.m_conn = new IRCConnection("irc.esper.net", 5555);
    }

    private updateSizeBindings(): void
    {
        this.width(window.innerWidth);
        this.height(window.innerHeight);
    }

    private onResize = (event: Event): boolean =>
    {
        this.updateSizeBindings();

        return true;
    }
}

/* ===================================================================== */
