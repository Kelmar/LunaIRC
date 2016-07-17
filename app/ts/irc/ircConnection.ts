/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import TransportBase from './transport/TransportBase';

import TcpTransport from './transport/TcpTransport';

/* ===================================================================== */

export class IRCConnection
{
    private m_transport: TransportBase;

    constructor(host: string, port: number)
    {
        this.m_transport = new TcpTransport();
    }
}

/* ===================================================================== */
