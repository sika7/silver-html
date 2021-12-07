import { SilverHtmlPlugin, SilverHtmlPluginManager } from "./interface";

import * as parse5 from "parse5";

class PluginManagerClass {
  name: string = "none";

  funcs: SilverHtmlPluginManager = {
    CommentNode: [],
    TextNode: [],
    ElementNode: [],
  };

  constructor() {}

  init(name: string, plugin: SilverHtmlPlugin) {
    this.name = name;
    this.resetFunction();

    // functions set
    const {
      CommentNode,
      ElementNode,
      TextNode,
    } = plugin;
    if (CommentNode) this.funcs["CommentNode"] = CommentNode;
    if (TextNode) this.funcs["TextNode"] = TextNode;
    if (ElementNode) this.funcs["ElementNode"] = ElementNode;
    return this;
  }

  resetFunction() {
    this.funcs = {
      CommentNode: [],
      ElementNode: [],
      TextNode: [],
    };
  }

  processElement(node: parse5.Element | null, level: number): parse5.Element | null {
    this.funcs["ElementNode"].map((func) => {
      if (node) node = func.function(node, level);
      if (!node) return
    });
    return node;
  }

  processComment(node: parse5.CommentNode, level: number): parse5.CommentNode {
    this.funcs["CommentNode"].map((func) => {
      node = func.function(node, level);
    });
    return node;
  }

  processText(node: parse5.TextNode, level: number): parse5.TextNode {
    this.funcs["TextNode"].map((func) => {
      node = func.function(node, level);
    });
    return node;
  }
}

export const PluginManager = new PluginManagerClass();
