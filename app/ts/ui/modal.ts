/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";

import {Log} from "../logging";

/* ===================================================================== */

export default class Modal
{
    private m_jqObject: JQuery;

    constructor(selector: string)
    {
        this.m_jqObject = jQuery(selector);

        this.m_jqObject.on('show.bs.modal', () => Log.debug("show.bs.modal"));
        this.m_jqObject.on('shown.bs.modal', () => Log.debug("shown.bs.modal"));
        this.m_jqObject.on('hide.bs.modal', () => Log.debug("hide.bs.modal"));
        this.m_jqObject.on('hidden.bs.modal', () => Log.debug("hidden.bs.modal"));
        this.m_jqObject.on('loaded.bs.modal', () => Log.debug("loaded.bs.modal"));
    }

    public show(): void
    {
        this.m_jqObject.modal();
    }
}

/* ===================================================================== */
