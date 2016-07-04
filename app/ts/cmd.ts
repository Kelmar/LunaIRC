import * as ko from 'knockout';

export class CommandLine {
    input: KnockoutObservable<string>

    public constructor()
    {
        this.input = ko.observable("");
    }

    private processCommand()
    {
        var text = this.input();
        this.input(''); // Clear the command line box.

        console.debug('COMMAND: ' + text);
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