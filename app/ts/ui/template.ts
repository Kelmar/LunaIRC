/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as hb from "handlebars";
import * as fs from "fs";

import {Log} from "../logging";
import {ThemeManager, ThemeInfo} from "./themeManager";

/* ===================================================================== */
/**
 * Simple template engine.
 * 
 * This is a wrapper around handlebars.
 * 
 * When the theme is changed, we will (re)load that theme's template file.
 */
export default class Template
{
    private m_name: string;
    private m_tm: ThemeManager;

    private m_templateFn: (model: any) => string;

    constructor(name: string, tm: ThemeManager)
    {
        this.m_name = name;
        this.m_tm = tm;

        this.m_tm.addListener("themeUpdating", this.loadTemplate);

        this.loadTemplate(this.m_tm.getTheme());
    }

    private loadTemplate = (currentTheme: ThemeInfo): void =>
    {
        var fileName = this.m_name.replace(/\.hb$/, "");
        var templatePath = `${currentTheme.path}/${fileName}.hb`;

        Log.info(`Loading ${this.m_name} for theme ${currentTheme.name} from ${templatePath}`);

        var data: string = fs.readFileSync(templatePath, { encoding: 'utf8' });
        this.m_templateFn = hb.compile(data);
    }

    public render(model: any): string
    {
        return this.m_templateFn(model);
    }
}

/* ===================================================================== */
