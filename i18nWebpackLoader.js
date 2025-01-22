module.exports = function loader(xml) {
    //var callback = this.async();
    var DOMParser = require('xmldom').DOMParser;
    var doc = new DOMParser().parseFromString(xml);
    return `
import {I18nNode} from "@green-code-studio/internationalization/i18nNode.js";
import {I18nTextValue} from "@green-code-studio/internationalization/i18nTextValue.js";
import {Translator} from "@green-code-studio/internationalization/translator.js";
import {LanguagesHierarchy} from "@green-code-studio/internationalization/languagesHierarchy.js";
console.log(I18nNode);
export const node = ${xmlToNode(doc.documentElement)};
export const translator=new Translator(LanguagesHierarchy.default, node.node);
export function t(q){var x=translator.translate(q);return x?x.toString():'';}
`;
}

function xmlToNode(xml) {
    let childNodes = Array.from(xml.childNodes).filter(x => x.tagName == 'node').map(x => xmlToNode(x));
    let values = Array.from(xml.childNodes).filter(x => x.tagName == 'value').map(x => xmlToValue(x));
    var name = xml.getAttribute("name")
    return `{name:${JSON.stringify(name)}, node:new I18nNode([${values.join(',')}],[${childNodes.join(',')}])}`;
}

function xmlToValue(xml) {
    var lang = xml.getAttribute("lang")
    var value='';
    for (let i=0;i<xml.childNodes.length;i++) {
        const childNode = xml.childNodes[i];
        if(childNode.nodeType==3){
            value+=childNode.nodeValue.replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim();
        }else if(childNode.nodeType==1 && childNode.tagName=='br'){
            value+='\r\n';
        }
    }
    return `{lang:${JSON.stringify(lang)}, value: new I18nTextValue(${JSON.stringify(value)})}`;
}
