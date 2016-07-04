export class Log
{
    protected static writeLog(level: string, message: string)
    {
        var l = ("     " + level).slice(-5);

        console.log(`${l}: ${message}`);
    }

    public static trace(message: string)
    {
        this.writeLog('TRACE', message);
    }

    public static debug(message: string)
    {
        this.writeLog('DEBUG', message);
    }

    public static info(message: string)
    {
        this.writeLog('INFO', message);
    }

    public static warn(message: string)
    {
        this.writeLog('WARN', message);
    }

    public static error(message: string)
    {
        this.writeLog('ERROR', message);
    }

    public static fatal(message: string)
    {
        this.writeLog('FATAL', message);
    }
}
