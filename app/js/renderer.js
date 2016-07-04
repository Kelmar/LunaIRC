const log = require('./logging.js');
//const irc = require('./irc.js');
const cmd = require('../ts/cmd.js');
const target = require('./target.js');

const ko = require('knockout');

const {remote} = require('electron');
const {Menu, MenuItem} = remote;

var luna = remote.getGlobal('luna');

const template = [
    {
        label: 'File',
        submenu: [
            { label: 'MenuItem1', click() { log.debug('Item 1 clicked, debugging: ' + luna.config.debug); }},
            { label: 'MenuItem2', type: 'checkbox', checked: true },
            { type: 'separator' },
            {
                label: 'Preferences...',
                click()
                {
                    log.debug('Preferences selected');
                }
            },
            {
                label: 'Developer Tools', 
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow)
                {
                    if (focusedWindow)
                        focusedWindow.webContents.toggleDevTools();
                }
            },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }
]

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

var model = {
    command: new cmd.CommandLine()
};

ko.applyBindings(model);
