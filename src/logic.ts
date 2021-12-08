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

/**
 * implementsParse5Text.
 *
 * @param {any} arg
 * @returns {arg is parse5.TextNode}
 */
export function implementsParse5Text(arg: any): arg is parse5.TextNode {
  return (
    arg !== null &&
    typeof arg === "object" &&
    typeof arg.nodeName === "string" &&
    arg.nodeName === "#text"
  );
}

/**
 * implementsParse5Comment.
 *
 * @param {any} arg
 * @returns {arg is parse5.CommentNode}
 */
export function implementsParse5Comment(arg: any): arg is parse5.CommentNode {
  return (
    arg !== null &&
    typeof arg === "object" &&
    typeof arg.nodeName === "string" &&
    arg.nodeName === "#comment"
  );
}

/**
 * arrayNonNullable.
 *
 * @param {T[]} items
 * @returns {T[]}
 */
function arrayNonNullable<T>(items: T[]): T[] {
  return items.filter((item: T): item is NonNullable<T> => item != null);
}

/**
 * rootNode.
 *
 * @param {parse5.DocumentFragment} node
 * @returns {parse5.DocumentFragment}
 */
function rootNode(node: parse5.DocumentFragment): parse5.DocumentFragment {
  if (node.nodeName === "#document-fragment")
    node.childNodes = childNodes(node.childNodes, 0);
  return node;
}

/**
 * elementNode. // ノードを判定しpluginの処理を行う
 *
 * @param {SilverHtmlNode} node
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function childNode(
  node: parse5.ChildNode,
  // plugin: SilverHtmlPlugin,
  level: number
) {
  if (implementsParse5Elemtnt(node)) {
    return elementNode(node, level);
  }
  if (implementsParse5Text(node)) {
    return textNode(node, level);
  }
  if (implementsParse5Comment(node)) {
    return commentNode(node, level);
  }
}

/**
 * commentNode.
 *
 * @param {parse5.CommentNode} node
 * @param {number} level
 */
export function commentNode(
  node: parse5.CommentNode,
  // plugin: SilverHtmlPlugin,
  level: number
) {
  return PluginManager.processComment(node, level)!;
}

/**
 * textNode.
 *
 * @param {parse5.TextNode} node
 * @param {number} level
 */
export function textNode(
  node: parse5.TextNode,
  // plugin: SilverHtmlPlugin,
  level: number
) {
  return PluginManager.processText(node, level);
}

/**
 * elementNode.
 *
 * @param {parse5.Element} node
 * @param {number} level
 */
export function elementNode(
  node: parse5.Element,
  // plugin: SilverHtmlPlugin,
  level: number
) {
  node = PluginManager.processElement(node, level)!;
  if (!node) return
  node.childNodes = childNodes(node.childNodes, level);
  return node;
}

/**
 * childElementNodes.
 *
 * @param {SilverHtmlNode} child
 * @param {silverHtmlPlugin} plugin
 * @param {number} level
 */
export function childNodes(
  child: parse5.ChildNode[],
  // plugin: SilverHtmlPlugin,
  level: number
): parse5.ChildNode[] {
  return arrayNonNullable<parse5.ChildNode>(child.map((node) => childNode(node, level + 1)!));
}

/**
 * silverHtml.
 *
 * @param {string} html
 * @param {SilverHtmlConfig} config
 * @param {SilverHtmlPlugin} plugins
 */
export function silverHtml(
  html: string,
  config: SilverHtmlConfig,
  plugins: SilverHtmlPlugin[]
) {
  let node = parse5.parseFragment(html);
  plugins.map((plugin) => {
    PluginManager.init(plugin.pluginName, plugin);
    try {
      node = rootNode(node);
    } catch (e) {
      throw new Error(`plugin: ${plugin.pluginName} ${e}`);
    }
  });
  return parse5.serialize(node);
}
