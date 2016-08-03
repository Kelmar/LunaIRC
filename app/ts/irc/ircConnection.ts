/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import TransportBase from './transport/transportBase';

import TcpTransport from './transport/tcpTransport';

import Message from "./ircMessage";

import {Log} from '../logging';

/* ===================================================================== */

export default class IRCConnection
{
    private m_transport: TransportBase;

    constructor(host: string, port: number)
    {
        var self = this;

        this.m_transport = new TcpTransport(host, port);

        this.m_transport.on('connect', () => self.sendLogin());
        this.m_transport.on('message', msg => self.processMessage(msg));

        this.m_transport.connect();
    }

    private sendLogin(): void
    {
        this.m_transport.sendMessage("USER jqtester . . :John Q. Tester");
        this.m_transport.sendMessage("NICK jqtester");
    }

    private processMessage(data: string): void
    {
        var message = new Message(data);

        if (message.command == "PING")
        {
            Log.info("PING? PONG!");
            
            if (message.params.length > 0)
                this.m_transport.sendMessage("PONG " + message.params[0]);
            else
                this.m_transport.sendMessage("PONG");   
        }

        Log.debug("Source: " + message.source);
        Log.debug("Command: " + message.command);
        Log.debug("Params: " + message.params.toString());
    }
}

/* ===================================================================== */
