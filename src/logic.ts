import * as parse5 from "parse5";
import { SilverHtmlChildNode, SilverHtmlConfig, SilverHtmlNode, SilverHtmlPlugin } from "./interface";

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

function executeFunction<T>(item: T, func: Function): T {
  return func(item)
}

function executeFunctions<T>(items: T[], func: Function): T[] {
  return arrayNonNullable<T>(items.map(item => func(item)))
}

function arrayNonNullable<T>(items: T[]): T[] {
  return items.filter((item: T): item is NonNullable<T> => item != null)
}

/**
 * elementNode. // ノードを判定しpluginの処理を行う
 *
 * @param {SilverHtmlNode} node
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function elementNode(
  node: SilverHtmlNode,
  plugin: SilverHtmlPlugin,
  level: number
) {
  // run plugin.
  node = parse5NodeAdapter(node, plugin, level);
  return node;
}

/**
 * childElementNodes.
 *
 * @param {SilverHtmlNode} child
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function childElementNodes(
  child: SilverHtmlChildNode[],
  plugin: SilverHtmlPlugin,
  level: number
) {
  if (!Array.isArray(child)) return child;
  const { Elements } = plugin;
  if (Elements) child = executeFunction<SilverHtmlChildNode[]>([...child], (items: any) => Elements(items, level));
  return executeFunctions<SilverHtmlChildNode>(child, (node: any) => elementNode(node, plugin, level + 1));
}

/**
 * parse5NodeAdapter.
 */
export function parse5NodeAdapter(
  node: SilverHtmlNode,
  plugin: SilverHtmlPlugin,
  level: number = 0
) {
  if (implementsParse5Elemtnt(node)) {
    const { Element, AttributeList, Attribute} = plugin;
    if (Element) node = executeFunction<parse5.Element>({ ...node }, (node: parse5.Element) => Element(node, level)) ;
    if (AttributeList && node.attrs)
      node.attrs = AttributeList([...node.attrs], node.tagName);
    if (Attribute && node.attrs) {
      node.attrs = node.attrs.map((attr: parse5.Attribute) =>
        Attribute(attr, node.nodeName)
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
export function parseHtml(html: string, parserName: string = "parse5"): SilverHtmlNode {
  if (parserName === "parse5") return parse5.parseFragment(html);
  throw new Error("not found parser.");
}

/**
 * serializeNode. // ノードからhtmlに変換する
 *
 * @param {SilverHtmlNode} node
 * @param {string} parserName
 * @returns {string}
 */
export function serializeNode(
  node: SilverHtmlNode,
  parserName: string = "parse5"
): string {
  if (parserName === "parse5") return parse5.serialize(node);
  throw new Error("not found serialize.");
}

/**
 * silverHtml.
 */
export function silverHtml(
  html: string,
  config: SilverHtmlConfig,
  plugins: SilverHtmlPlugin[]
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
