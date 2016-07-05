/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';

/* ===================================================================== */

export class CommandLine
{
    input: KnockoutObservable<string>

    public constructor()
    {
        this.input = ko.observable("");
    }

    private processCommand()
    {
        var text = this.input.peek();
        this.input(''); // Clear the command line box.

        // TODO: Send the command along here.

        console.debug('COMMAND: ' + text);
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
