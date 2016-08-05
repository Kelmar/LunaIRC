/* ===================================================================== */
/*
 * LunaIRC
 * 
 * Copyright (c) 2016 by Bryce Simonds
 */
/* ===================================================================== */

import * as fs from 'fs';

import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";

import {Log} from "../logging";

/* ===================================================================== */

export default class Modal
{
    private m_jqObject: JQuery;
    private m_html: string;

    constructor(selector: string, htmlFile: string)
    {
        this.m_jqObject = jQuery(selector);

        this.m_jqObject.on('show.bs.modal', () => Log.debug("show.bs.modal"));
        this.m_jqObject.on('shown.bs.modal', () => Log.debug("shown.bs.modal"));
        this.m_jqObject.on('hide.bs.modal', () => Log.debug("hide.bs.modal"));
        this.m_jqObject.on('hidden.bs.modal', () => Log.debug("hidden.bs.modal"));
        this.m_jqObject.on('loaded.bs.modal', () => Log.debug("loaded.bs.modal"));

        try
        {
            this.m_html = fs.readFileSync(htmlFile, "utf-8");
        }
        catch (e)
        {
            var errMsg = `Unable to read HTML file '${htmlFile}': ${e}'`;
            Log.error(errMsg); 

            errMsg = errMsg
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
            ;
            
            this.m_html = `<div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;
        Unable to load HTML file: ${htmlFile}
    </h4>
</div>
<div class="modal-body">
    <div class="alert alert-danger" role="alert">
        <button
            type="button"
            class="close"
            data-toggle="collapse"
            data-target="#detail-block"
            aria-label="Details"
            aria-expand="false"
            aria-controls="detail-block">
            <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
        </button>
        <p><strong>Congrats!</strong>  You found a bug, now go report it!</p>
        <div class="collapse" id="detail-block">
            <hr />
            <h4>Exception Info</h4>
            <div class="well well-sm">${e}</div>
        </div>
    </div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" style="float: left">
        <span class="fa fa-bug" aria-hidden="true"></span>&nbsp;
        Send Report
    </button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
</div>`;
        }
    }

    public show(): void
    {
        var jqInnerPart = this.m_jqObject.find("div.modal-content");

        //ko.cleanNode(jqInnerPart[0]);
        jqInnerPart.html(this.m_html);

        //ko.applyBindings(model, jqInnerPart[0]);

        this.m_jqObject.modal();
    }
}

/* ===================================================================== */
