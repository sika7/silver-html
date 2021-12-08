import { SilverHtmlPlugin, SilverHtmlPluginManager } from "./interface";

import * as parse5 from "parse5";

class PluginManagerClass {
  name: string = "none";
  functionName: string = ""

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

  processElement(node: parse5.Element, level: number): parse5.Element | null {
    try {
      this.funcs["ElementNode"].map((func) => {
        this.functionName = func.name
        node = func.function(node, level)!;
        if (!node) return
      });
    } catch (error) {
      throw new Error(`${this.functionName} error.`);
    }
    return node;
  }

  processComment(node: parse5.CommentNode, level: number): parse5.CommentNode | null {
    try {
      this.funcs["CommentNode"].map((func) => {
        this.functionName = func.name
        node = func.function(node, level)!;
        if (!node) return
      });
    } catch (error) {
      throw new Error(`${this.functionName} error.`);
    }
    return node;
  }

  processText(node: parse5.TextNode, level: number): parse5.TextNode | null {
    try {
      this.funcs["TextNode"].map((func) => {
        this.functionName = func.name
        node = func.function(node, level)!;
        if (!node) return
      });
    } catch (error) {
      throw new Error(`${this.functionName} error.`);
    }
    return node;
  }
}

export const PluginManager = new PluginManagerClass();
