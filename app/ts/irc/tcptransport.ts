import ITransport from "./iTransport";

/**
 * Handles IRC messages that are terminated with a CR-LF pair.
 */
export default class TcpTransport implements ITransport
{
    public sendMessage(message): void
    {
    }
}
