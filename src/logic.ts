import * as parse5 from "parse5";
import { silverHtmlConfig, silverHtmlPlugin } from "./interface";

/**
 * implementsParse5Elemtnt.
 *
 * @param {any} arg
 * @returns {arg is parse5.Element}
 */
export function implementsParse5Elemtnt(arg: any): arg is parse5.Element {
  return (
    arg !== null &&
    typeof arg === "object" &&
    typeof arg.nodeName === "string" &&
    arg.nodeName !== "#text" &&
    arg.nodeName !== "#comment"
  );
}

/**
 * elementNode. // ノードを判定しpluginの処理を行う
 *
 * @param {any} node
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function elementNode(
  node: any,
  plugin: silverHtmlPlugin,
  level: number
) {
  // run plugin.
  node = parse5NodeAdapter(node, plugin, level);
  return node;
}

/**
 * childElementNodes.
 *
 * @param {any} child
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function childElementNodes(
  child: any,
  plugin: silverHtmlPlugin,
  level: number
) {
  if (!Array.isArray(child)) return child;
  if (plugin) {
    const { Elements } = plugin;
    if (Elements) child = Elements([...child], level);
  }
  return child
    .map((node: any) => elementNode(node, plugin, level + 1))
    .filter((node: any) => node !== null);
}

/**
 * parse5NodeAdapter.
 */
export function parse5NodeAdapter(
  node: any,
  plugin: silverHtmlPlugin,
  level: number = 0
) {
  if (implementsParse5Elemtnt(node)) {
    const { Tag, Element, AttributeList, Attribute } = plugin;
    if (Element) node = Element({ ...node }, level);
    if (!node) return null;
    if (Tag && node.tagName) node.tagName = Tag(node.tagName, level);
    if (AttributeList && node.attrs)
      node.attrs = AttributeList([...node.attrs], node.tagName);
    if (Attribute && node.attrs) {
      node.attrs = node.attrs.map((attr: parse5.Attribute) =>
        Attribute(attr, node.tagName)
      );
    }
    if (node.childNodes)
      node.childNodes = childElementNodes(node.childNodes, plugin, level);
  }
  return node;
}

/**
 * parseHtml. // htmlの文字列をノードに変換する
 *
 * @param {string} html
 * @param {string} parserName
 */
export function parseHtml(html: string, parserName: string = "parse5") {
  if (parserName === "parse5") return parse5.parseFragment(html);
  throw new Error("not found parser.");
}

/**
 * serializeNode. // ノードからhtmlに変換する
 *
 * @param {any} node
 * @param {string} parserName
 * @returns {string}
 */
export function serializeNode(
  node: any,
  parserName: string = "parse5"
): string {
  if (parserName === "parse5") return parse5.serialize(node);
  return "";
}

/**
 * silverHtml.
 */
export function silverHtml(
  html: string,
  config: silverHtmlConfig,
  plugins: silverHtmlPlugin[]
) {
  let node = parseHtml(html);
  plugins.map((plugin) => {
    try {
      node = elementNode(node, plugin, 0);
    } catch (e) {
      throw new Error(`${plugin.pluginName} plugin error.`);
    }
  });
  return serializeNode(node);
}
