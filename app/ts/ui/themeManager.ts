/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as fs from "fs";
import * as async from 'async';
import * as hb from "handlebars";

global["Handlebars"] = global["Handlebars"] || hb;

import {EventSender} from '../base/event';
import {Log} from "../logging";
import Template from "./template";

/* ===================================================================== */

const THEME_PATH: string = "app/resources/themes";

/* ===================================================================== */

export class ThemeInfo
{
    public name          : string;
    public displayName   : string;
    public description   : string;
    public version       : string;
    public targetVersions: string[];
    public path          : string;

    public constructor(obj: any)
    {
        // TODO: Validate all needed keys are present.

        for (var key in obj)
            this[key] = obj[key];
    }
}

/* ===================================================================== */
/**
 * Manages all themes in the system.
 * 
 * When a user selects a different theme, the ThemeManager will send
 * an event to the currently loaded Template objects causing them to reload
 * themselves from disk.
 */
export class ThemeManager extends EventSender
{
    private m_themes: ThemeInfo[];
    private m_currentTheme: ThemeInfo;

    /**
     * List of template files by name.
     */
    private m_templates: { [id: string]: Template };

    public constructor()
    {
        super();

        this.m_templates = {};

        this.scanThemes();

        var allThemeNames: string[] = Object.keys(this.m_themes);

        if (allThemeNames.length == 0)
            throw "No themes found!";

        var defaultTheme: string = ("default" in this.m_themes) ? "default" : allThemeNames[0];
        Log.info(`Using "${defaultTheme}" as default theme.`);

        this.setTheme(defaultTheme);
    }

    public dispose()
    {
        this.m_templates = null;
        this.m_themes = null;
        this.m_currentTheme = null;

        super.dispose();
    }

    /**
     * Finds installed themes.
     */
    private scanThemes(): void
    {
        var files = fs.readdirSync(THEME_PATH);

        this.m_themes = [];

        // A more experienced node programmer could probably do this in parallel.
        for (var key in files)
        {
            var path = THEME_PATH + "/" + files[key];
            var file = fs.statSync(path);

            if (!file.isDirectory())
                continue;

            var info: ThemeInfo = this.readThemeInfo(path, file);

            if (info != null)
            {
                if (info.name in this.m_themes)
                    Log.warn(`A theme named ${info.name} has already been parsed, disregarding....`);
                else
                    this.m_themes[info.name] = info;
            }
        }
    }

    /**
     * Pulls in the json description of a theme.
     * 
     * Returns null on error.
     */
    private readThemeInfo(path: string, file: fs.Stats): ThemeInfo
    {
        // A more experienced node programmer could probably do this in parallel.
        try
        {
            var infoJson: string = fs.readFileSync(path + '/info.json', { encoding: 'utf8' });
            var info = JSON.parse(infoJson);

            info.path = path;

            return new ThemeInfo(info);
        }
        catch (e)
        {
            Log.error(`Unable to read info.json in ${path}: ${e}`);
            return null;
        }
    }

    /**
     * Loads a single template file from the current theme.
     * 
     * @param name The name of the template file to load.
     */
    private loadTemplate(name: string): void
    {
        if (this.m_templates[name] == null)
        {
            this.m_templates[name] = new Template(name, this);
        }
    }

    /**
     * Returns a list of all detected themes.
     */
    public get themes(): ThemeInfo[]
    {
        return this.m_themes;
    }

    /** 
     * Gets information on the currently loaded theme.
     */
    public getTheme(): ThemeInfo
    {
        return this.m_currentTheme;
    }

    /**
     * Changes the currently selected theme.
     */
    public setTheme(name: string): void
    {
        if (!(name in this.m_themes))
            throw `Unknown theme ${name}`;

        // Save the current theme incase there's a problem.
        var oldTheme = this.m_currentTheme;

        try
        {
            this.m_currentTheme = this.m_themes[name];
            this.emit("themeUpdating", this.m_currentTheme);
        }
        catch (e)
        {
            Log.error(`There was an error loading theme ${name}: ${e}`);

            if (oldTheme != null)
            {
                Log.error(`Reverting back to theme ${oldTheme.name}`);

                // TODO: Should we mark errored themes so the user will know?

                this.m_currentTheme = oldTheme;
                this.emit("themeUpdating", this.m_currentTheme);
            }
            else
            {
                Log.fatal("Unable to load default theme!");
            }
        }

        this.emit("themeChanged");
    }

    /**
     * Gets a template from the theme.
     * 
     * Template files are preloaded and cached.  Calling setTheme() with
     * the currently selected theme will force a reload of files into cache.
     * 
     * The name of the template is the filename sans any path or extension
     * info.  For example: "index" will load the thems "index.hb" file.
     */
    public getTemplate(name: string): Template
    {
        this.loadTemplate(name);
        return this.m_templates[name];
    }
}

/* ===================================================================== */