/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

const extend = require('util')._extend;

const {app, BrowserWindow} = require('electron');

/* ===================================================================== */

const log = require('./app/js/logging.js');
const config = require('./app/js/config.js');

/* ===================================================================== */

global.luna = {
    config: {
        debug: false,
        win: {
            width: 800,
            height: 600
        }
    }
};

// Global reference to the main window so it doesn't get GCed
global.mainWindow = null;

/* ===================================================================== */

function createMainWindow()
{
    var options = { width: luna.config.win.width, height: luna.config.win.height };

    mainWindow = new BrowserWindow(options);

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.on('closed', function()
    {
        luna.config.win = {
            'width': mainWindow.width,
            'height': mainWindow.height
        };

        mainWindow = null;
    });
}

/* ===================================================================== */

function readConfig()
{
    luna.config = extend(luna.config, config.load());
}

/* ===================================================================== */

function initialize()
{
    readConfig();
    createMainWindow();
}

/* ===================================================================== */

app.on('window-all-closed', function()
{
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', initialize);

app.on('quit', function ()
{
    config.save();
})

// Quit when all windows are closed.
app.on('window-all-closed', function ()
{
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
    {
        app.quit()
    }
})

app.on('activate', function ()
{
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        createMainWindow()
    }
})

/* ===================================================================== */
