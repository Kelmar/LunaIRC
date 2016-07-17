/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {Log} from '../logging';

/* ===================================================================== */

export default class Message
{
    public source: string;
    public command: string;
    public params: string[];

    constructor(message?: string)
    {
        this.source = "";
        this.command = "";
        this.params = [];

        this.parse(message);
    } 

    private parse(message?: string) 
    {
        if (message == null) 
            return;

        // Save the original message incase we need to log an error.
        const ORIG_MESSAGE: string = message;

        var match: RegExpExecArray;

        if (message[0] == ':')
        {
            match = /[\s\t\v]/i.exec(message);

            if (match == null)
            {
                Log.warn("Malformed message from IRC server: " + ORIG_MESSAGE);
                return;
            }

            this.source = message.substr(1, match.index - 1);
            message = message.substr(match.index + 1).trim();
        }

        while (message.length > 0)
        {
            if (message[0] == ':')
            {
                // To end of line match
                this.params.push(message.substr(1));
                break;
            }

            match = /[\s\t\v]/i.exec(message);

            if (match == null)
            {
                // No more parameters left
                this.params.push(message);
                break;
            }

            this.params.push(message.substr(0, match.index).trim());
            message = message.substr(match.index + 1).trim();
        }

        this.command = this.params.shift();
    }
}

/* ===================================================================== */
