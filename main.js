import URLSearchParams from 'url-search-params';
import JsBarcode from 'jsbarcode';
import { DOMImplementation, XMLSerializer } from 'xmldom';
import { optimize } from 'svgo';
import { logger } from 'log';

export function onClientRequest(request) {

    logger.log('Entering onClientRequest');

    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // grab the qs, assign the value
    const rawQuery = new URLSearchParams(request.query);
    const bcText = String(rawQuery.get('value')) || 'BUY DOGE';
    const bcObj = { xmlDocument: document };
    const config = {
        plugins: [
            'removeDoctype'
        ]
    };

    bcObj.format = String(rawQuery.get('format')) || 'auto';
    bcObj.width = Number(rawQuery.get('width')) || 2;
    bcObj.height = Number(rawQuery.get('height')) || 100;
    bcObj.displayValue = Boolean(rawQuery.get('displayValue')) || true;
    bcObj.fontOptions = String(rawQuery.get('fontOptions')) || '';
    bcObj.font = String(rawQuery.get('font')) || 'monospace';
    bcObj.textAlign = String(rawQuery.get('textAlign')) || 'center';
    bcObj.textPosition = String(rawQuery.get('textPosition')) || 'bottom';
    bcObj.textMargin = Number(rawQuery.get('textMargin')) || 2;
    bcObj.fontSize = Number(rawQuery.get('fontSize')) || 20;
    bcObj.background = String(`#${rawQuery.get('background')}`) || '#ffffff';
    bcObj.lineColor = String(`#${rawQuery.get('lineColor')}`) || '#000000';
    bcObj.margin = Number(rawQuery.get('margin')) || 10;
    bcObj.marginTop = Number(rawQuery.get('marginTop'));
    bcObj.marginBottom = Number(rawQuery.get('marginBottom'));
    bcObj.marginLeft = Number(rawQuery.get('marginLeft'));
    bcObj.marginRight = Number(rawQuery.get('marginRight'));

    logger.log(`bcObject built: ${bcObj}`);

    // generate the barcode from parameters
    JsBarcode(svgNode, bcText, bcObj);
    const svgText = xmlSerializer.serializeToString(svgNode);
    const stringify = JSON.stringify(svgText);

    logger.log(`svgText generated: ${stringify}`);
    logger.log('Building response');

    // build response object returning our barcode
    request.respondWith(
        200
        , { 'Content-Type': ['image/svg+xml'] }
        , optimize(svgText, { ...config })
    );
}