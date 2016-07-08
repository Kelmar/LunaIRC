/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {EventEmitter} from "events";

import * as ko from 'knockout';

/* ===================================================================== */

export default class CommandLine extends EventEmitter
{
    public input: KnockoutObservable<string>

    public constructor()
    {
        super();
        this.input = ko.observable("");
    }

    private processCommand()
    {
        var text: string = this.input.peek().trim();
        this.input(''); // Clear the command line box.

        if (text != "")
        {
            // Only fire an event if we actually have something to process!

            this.emit(
                "command",
                {
                    source: this,
                    command: text
                }
            );
        }
    }

    public handleKeypress(data, event)
    {
        switch (event.keyCode)
        {
        case 10:
        case 13:
            this.processCommand();
            return false;
        }

        return true;
    }
}

/* ===================================================================== */
