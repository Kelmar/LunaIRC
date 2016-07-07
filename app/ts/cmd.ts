/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as ko from 'knockout';

/* ===================================================================== */

export default class CommandLine
{
    public input: KnockoutObservable<string>
    private m_callback: (cmd: string) => any;

    public constructor(callback: (cmd: string) => any)
    {
        this.m_callback = callback;

        this.input = ko.observable("");
    }

    private processCommand()
    {
        var text = this.input.peek();
        this.input(''); // Clear the command line box.

        this.m_callback(text);
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
