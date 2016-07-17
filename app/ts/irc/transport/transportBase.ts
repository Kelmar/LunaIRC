/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {EventSender} from "../../base/event";

/* ===================================================================== */

/**
 * Handles the notion of a single packet or message from a server.
 * 
 * - For direct TCP/IP connections this would be a single message terminated by a CR-LF pair.
 * - For web sockets this would be a single frame.
 * - For web long polling the message is wrapped inside of a JSON POST request.
 * - For testing we can simply supply a dummy packate generator and run behaivor tests on the
 *   IRC system w/o having to connect to any actual server.  
 */
abstract class TransportBase extends EventSender
{
    public abstract sendMessage(message): void;
}

export default TransportBase;

/* ===================================================================== */
