/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

export class Log
{
    protected static writeLog(level: string, message: string): void
    {
        var l = ("     " + level).slice(-5);

        console.log(`${l}: ${message}`);
    }

    public static trace(message: string): void
    {
        this.writeLog('TRACE', message);
    }

    public static debug(message: string): void
    {
        this.writeLog('DEBUG', message);
    }

    public static info(message: string): void
    {
        this.writeLog('INFO', message);
    }

    public static warn(message: string): void
    {
        this.writeLog('WARN', message);
    }

    public static error(message: string): void
    {
        this.writeLog('ERROR', message);
    }

    public static fatal(message: string): void
    {
        this.writeLog('FATAL', message);
    }
}

/* ===================================================================== */
