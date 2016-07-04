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

const log = require('./logging.js');
const fs = require('fs');
const extend = require('util')._extend;

/* ===================================================================== */

const CONFIG_DIRECTORY = app.getPath('appData') + "/luna";
const CONFIG_FILE_NAME = CONFIG_DIRECTORY + "/prefernces.json";

/* ===================================================================== */

exports.values = {
    debug: false,
    win: {
        width: 800,
        height: 600
    }
};

/* ===================================================================== */

exports.save = function()
{
    try
    {
        fs.mkdirSync(CONFIG_DIRECTORY);
    }
    catch (e)
    {
        if (e.code != "EEXIST")
        {
            log.error("Unable to verify existance of config directory: " + JSON.stringify(e));
            return;
        }
    }

    let configData = JSON.stringify(exports.values);
    log.debug("Saving config data: " + configData);

    fs.writeFile(CONFIG_FILE_NAME, configData, (err) =>
    {
        if (err)
            log.error("Unable to write to config file '" + CONFIG_FILE_NAME + ": " + err);
        else
            log.debug("Config file saved: " + CONFIG_FILE_NAME);
    });
}

/* ===================================================================== */

log.debug("Loading config file: " + CONFIG_FILE_NAME);

fs.readFile(CONFIG_FILE_NAME, (err, data) =>
{
    if (err)
        log.error("Unable to read config file '" + CONFIG_FILE_NAME + ": " + err);
    else if (data != "")
    {
        log.debug("Read config file data: " + data);

        try
        {
            let configData = JSON.parse(data);
            extend(exports.values, configData);
        }
        catch (e)
        {
            log.error("Unable to parse config file data: " + e);
        }
    } 
});

/* ===================================================================== */
