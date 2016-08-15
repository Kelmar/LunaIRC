/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as url from 'url';
import * as fs from 'fs';

import * as jQuery from "jquery";

/* ===================================================================== */
/**
 * Simple template engine.
 * 
 * Uses the ECMA Script 6 template litteral to perform templating.
 * 
 * This is not only super simple, but also rediculously fast! :)
 */
export default class Template
{
    private m_precompiled: () => string;
    private m_format: string;

    constructor()
    {
        this.m_format = "";
        this.compile();
    }

    private compile(): void
    {
        this.m_precompiled = eval('(function () { return `' + this.m_format + '`; })');
    }

    public get format(): string { return this.m_format; }
    public set format(value: string)
    {
        this.m_format = value;
        this.compile();
    }

    public render(model: any): string
    {
        return this.m_precompiled.call(model);
    }

    /**
     * Generates a Template object, with a preset format.
     */
    public static fromString(format: string): Template
    {
        var rval = new Template();

        rval.format = format;

        return rval;
    }

    /**
     * Generates a Template object using a DOM element for formatting.
     */
    public static fromDom(selector: string): Template
    {
        var $element = $(selector);

        if ($element.length < 0)
            throw `Element not found ${selector}`;

        return Template.fromString($element.html());
    }

    /**
     * Generates a Template object with the contents of a file for the format.
     */
    public static fromFile(path: string): Template
    {
        var html: string;
        
        try
        {
            html = fs.readFileSync(path, "utf-8");
        }
        catch (e)
        {
            var errMsg = `Unable to read template file '${path}': ${e}'`;
            throw errMsg;
        }

        return Template.fromString(html);
    }
}

/* ===================================================================== */
