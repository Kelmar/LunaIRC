/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';

import {EventSender} from '../base/event';

/* ===================================================================== */

export default class CommandLine extends EventSender
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
