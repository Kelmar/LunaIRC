/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {Socket} from 'net';

import TransportBase from "./transportBase";

/* ===================================================================== */

/**
 * Handles IRC messages that are terminated with a CR-LF pair.
 */
export default class TcpTransport extends TransportBase
{
    private m_fd: Socket;

    /**
     * Buffer for holding partial messages.
     */
    private m_buffer: Buffer;

    /**
     * Number of bytes currently saved in the buffer.
     */
    private m_bufferLength: number;

    public constructor()
    {
        super();

        var self = this;

        this.m_fd = new Socket();

        /*
         * IRC messages are supposed to only be 512 bytes; we
         * should only need to hold on to at most one message.
         */
        this.m_buffer = new Buffer(512);
        this.m_bufferLength = 0;

        /*
         * We manage the encoding ourselves.
         * 
         * Some servers/clients might be using ISO-646 or ISO-8859-1
         */
        this.m_fd.setEncoding(null);

        this.m_fd.on('data', data => self.onData(data));
        this.m_fd.on('connect', () => self.onConnected());
        this.m_fd.on('close', hadError => self.onClosed(hadError));
        this.m_fd.on('error', error => self.onError(error));
    }

    public dispose(): void
    {
        this.m_bufferLength = 0;
        this.m_buffer = null;
        
        if (this.m_fd != null)
        {
            this.m_fd.destroy();
            this.m_fd = null;
        }

        super.dispose();
    }

    private onConnected()
    {
        this.emit("connect");
    }

    private onClosed(hadError: boolean)
    {
        this.emit('closed', hadError);

        this.m_fd = null;
        this.m_bufferLength = 0;
    }

    private onError(error: Error)
    {
        this.emit('error', error);
    }

    private onData(data: Buffer)
    {
        var str: string = data.toString('utf-8');

        while (str.length > 0)
        {
            var pos = str.indexOf("\r\n");

            if (pos == -1)
            {
                // Not a complete message, save for next go around.

                if (str.length > 0)
                    this.m_bufferLength += this.m_buffer.write(str, this.m_bufferLength);

                return;
            }
            else
            {
                var message: string = "";
                
                if (this.m_bufferLength > 0) 
                {
                    message = this.m_buffer.slice(0, this.m_bufferLength).toString('utf-8');
                    this.m_bufferLength = 0;
                }

                message += str.substring(0, pos);
                str = str.substr(pos + 2);

                this.emit("message", message);
            }
        }
    }

    public sendMessage(message): void
    {
        this.m_fd.write(message);
        this.m_fd.write("\r\n");
    }
}

/* ===================================================================== */
