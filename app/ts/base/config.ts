/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import {app} from "electron";
import * as fs from "fs";

import * as ko from "knockout";

import {Log} from "../logging";

/* ===================================================================== */

export class ConfigFile
{
    public static load(): Object
    {
        var data = ConfigFile.loadJson();

        return JSON.parse(data);
    }

    private static loadJson(): string
    {
        var fileName = ConfigFile.name;

        Log.debug(`Loading settings file: ${fileName}`);

        try
        {
            return fs.readFileSync(fileName, "utf-8");
        }
        catch (e)
        {
            Log.error(`Unable to read settings file '${fileName}': ${e}`);
            return "";
        }
    }

    public static save(data: Object)
    {
        var json = ko.toJSON(data);
        ConfigFile.saveJson(json);
    }

    private static saveJson(data: string)
    {
        var dirName = ConfigFile.directory;
        var fileName = ConfigFile.name;

        try
        {
            fs.mkdir(dirName)
        }
        catch (e)
        {
            if (e.code != "EEXIST")
            {
                Log.error(`Unable to create directory: '${dirName}': ${e}`);
                return;
            }
        }

        Log.debug(`Saving settings data: ${data}`);

        fs.writeFile(fileName, data, (err) =>
        {
            if (err)
                Log.error(`Unable to write to settings file '${fileName}': ${err}'`);
            else
                Log.debug(`Setting files saved: ${fileName}`);
        });
    }

    public static get directory(): string
    {
        return app.getPath("appData") + "/luna";
    }

    public static get fileName(): string
    {
        return ConfigFile.directory + "/settings.json";
    }
}

/* ===================================================================== */

export class Settings
{
    public username: KnockoutObservable<string>;
    public nickname: KnockoutObservable<string>;
    public realname: KnockoutObservable<string>;

    constructor()
    {
        this.username = ko.observable("");
        this.nickname = ko.observable("");
        this.realname = ko.observable("");
    }

    public loadFrom(js: any)
    {
        this.username(js.username);
        this.nickname(js.nickname);
        this.realname(js.realname);
    }
}

/* ===================================================================== */
