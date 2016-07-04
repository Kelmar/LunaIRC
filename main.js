/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const log = require('./app/js/logging.js');
const config = require('./app/js/config.js');

/* ===================================================================== */

global.luna = {
    config: config.values
};

// Global reference to the main window so it doesn't get GCed
let mainWindow = null;

/* ===================================================================== */

function createMainWindow()
{
    var options = { width: 800, height: 600 };

    mainWindow = new BrowserWindow(options);

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.on('closed', function()
    {
        mainWindow = null;
    });
}

/* ===================================================================== */

function readConfig()
{
    for (let i = 2; i < process.argv.length; ++i)
    {
        let option = process.argv[i];

        switch (option)
        {
        case "--debug":
            log.info("Got debug option.");
            luna.config.debug = true;
            break;

        default:
            log.warn("Unknown option: ", option)
            break;
        }
    }
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
