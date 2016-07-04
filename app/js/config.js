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

const {Log} = require('../ts/logging.js');
const fs = require('fs');

/* ===================================================================== */

const CONFIG_DIRECTORY = app.getPath('appData') + "/luna";
const CONFIG_FILE_NAME = CONFIG_DIRECTORY + "/prefernces.json";

/* ===================================================================== */

exports.save = function(config)
{
    try
    {
        fs.mkdirSync(CONFIG_DIRECTORY);
    }
    catch (e)
    {
        if (e.code != "EEXIST")
        {
            Log.error("Unable to verify existance of config directory: " + JSON.stringify(e));
            return;
        }
    }

    let configJSON = JSON.stringify(config);
    Log.debug("Saving config data: " + configJSON);

    fs.writeFile(CONFIG_FILE_NAME, configJSON, (err) =>
    {
        if (err)
            Log.error("Unable to write to config file '" + CONFIG_FILE_NAME + ": " + err);
        else
            Log.debug("Config file saved: " + CONFIG_FILE_NAME);
    });
};

/* ===================================================================== */

exports.load = function()
{
    Log.debug("Loading config file: " + CONFIG_FILE_NAME);

    try
    {
        var configJSON = fs.readFileSync(CONFIG_FILE_NAME);
        return JSON.parse(configJSON);
    }
    catch (e)
    {
        Log.error("Unable to read config file '" + CONFIG_FILE_NAME + ": " + JSON.stringify(e));
        return {};
    }
};

/* ===================================================================== */
