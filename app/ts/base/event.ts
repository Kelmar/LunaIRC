/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {EventEmitter} from "events";

import IDisposable from './iDisposable';

/* ===================================================================== */

export abstract class EventSender extends EventEmitter implements IDisposable
{
    public dispose()
    {
        this.removeAllListeners();
    }
}

/* ===================================================================== */
