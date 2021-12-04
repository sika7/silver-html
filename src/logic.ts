import * as parse5 from "parse5";
import { SilverHtmlConfig, SilverHtmlPlugin } from "./interface";
import { PluginManager } from "./plugin";

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

// function executeFunction<T>(item: T, func: Function): T {
//   return func(item);
// }
// 
// function executeFunctions<T>(items: T[], func: Function): T[] {
//   return arrayNonNullable<T>(items.map((item) => func(item)));
// }
// 
// function arrayNonNullable<T>(items: T[]): T[] {
//   return items.filter((item: T): item is NonNullable<T> => item != null);
// }

function rootNode(node: parse5.DocumentFragment): parse5.DocumentFragment {
  if (node.nodeName === "#document-fragment")
    node.childNodes = childElementNodes(node.childNodes, 0);
  return node;
}

/**
 * elementNode. // ノードを判定しpluginの処理を行う
 *
 * @param {SilverHtmlNode} node
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function elementNode(
  node: parse5.ChildNode,
  // plugin: SilverHtmlPlugin,
  level: number
) {
  if (implementsParse5Elemtnt(node)) {
    node = PluginManager.processElement({ ...node }, level);
    node.attrs = PluginManager.processAttributes(
      [...node.attrs],
      node.tagName,
      level
    );
    node.childNodes = childElementNodes(node.childNodes, level);
  }
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
  child: parse5.ChildNode[],
  // plugin: SilverHtmlPlugin,
  level: number
): parse5.ChildNode[] {
  if (!Array.isArray(child)) return child;
  // child = PluginManager.processElements([...child], level);
  return child.map((node) => elementNode(node, level + 1));
}

/**
 * silverHtml.
 */
export function silverHtml(
  html: string,
  config: SilverHtmlConfig,
  plugins: SilverHtmlPlugin[]
) {
  let node = parse5.parseFragment(html);
  plugins.map((plugin) => {
    PluginManager.init(plugin.name, plugin);
    try {
      node = rootNode(node);
    } catch (e) {
      throw new Error(`${plugin.name} plugin error.`);
    }
  });
  return parse5.serialize(node);
}
