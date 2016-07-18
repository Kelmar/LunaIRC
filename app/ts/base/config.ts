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

export default class Configuration
{
    constructor ()
    {
        this.load();
    }

    private load(): void
    {
        var data = this.loadJson();

        var js = JSON.parse(data);

        //ko.mapping.fromJS(js, {}, this);
    }

    private loadJson(): string
    {
        var fileName = this.getConfigFileName();

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

    private save()
    {
        var data = ko.toJSON(this);
        this.saveJson(data);
    }

    private saveJson(data: string)
    {
        var dirName = this.getConfigDirectory();
        var fileName = this.getConfigFileName();

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

    public getConfigDirectory(): string
    {
        return app.getPath("appData") + "/luna";
    }

    public getConfigFileName(): string
    {
        return this.getConfigDirectory() + "/settings.json";
    }
}

/* ===================================================================== */
