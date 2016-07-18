/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

const {Log} = require('../ts/logging.js');

const {MainWindow} = require('../ts/ui/mainWindow.js');

const {remote, shell} = require('electron');
const {Menu, MenuItem} = remote;

/* ===================================================================== */

var luna = remote.getGlobal('luna');

/* ===================================================================== */

// TODO: Remove some of this hard coded junk

const template = [
    {
        label: 'File',
        submenu: [
            { label: 'MenuItem1', click() { Log.debug('Item 1 clicked, debugging: ' + luna.config.debug); }},
            { label: 'MenuItem2', type: 'checkbox', checked: true },
            { type: 'separator' },
            {
                label: 'Settings...',
                click()
                {
                    global.jQuery('#settings-dialog').modal();
                }
            },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: 'Documentation',
                click()
                {
                    shell.openExternal("https://github.com/Kelmar/LunaIRC");
                }
            },
            { type: 'separator' },
            {
                label: 'Developer Tools', 
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow)
                {
                    if (focusedWindow)
                        focusedWindow.webContents.toggleDevTools();
                }
            },
            {
                label: "Reload",
                accelerator: "CmdOrCtrl+R",
                click (item, focusedWindow)
                {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            { type: 'separator' },
            { label: 'About' },

        ]
    }
]

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

/* ===================================================================== */

global.mainWindow = new MainWindow();

/* ===================================================================== */
