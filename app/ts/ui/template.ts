/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
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
}

/* ===================================================================== */
