import { SilverHtmlPlugin, SilverHtmlPluginManager } from "./interface";

import * as parse5 from "parse5";

class PluginManagerClass {
  name: string = "none";

  funcs: SilverHtmlPluginManager = {
    ChildNode: [],
    CommentNode: [],
    TextNode: [],
    ElementNode: [],
    Attribute: [],
    Attributes: [],
  };

  constructor() {}

  init(name: string, plugin: SilverHtmlPlugin) {
    this.name = name;
    this.resetFunction();

    // functions set
    const {
      ChildNode,
      CommentNode,
      ElementNode,
      TextNode,
      Attribute,
      Attributes,
    } = plugin;
    if (ChildNode) this.funcs["ChildNode"] = ChildNode;
    if (CommentNode) this.funcs["CommentNode"] = CommentNode;
    if (TextNode) this.funcs["TextNode"] = TextNode;
    if (ElementNode) this.funcs["ElementNode"] = ElementNode;
    if (Attributes) this.funcs["Attributes"] = Attributes;
    if (Attribute) this.funcs["Attribute"] = Attribute;
    return this;
  }

  resetFunction() {
    this.funcs = {
      ChildNode: [],
      CommentNode: [],
      ElementNode: [],
      TextNode: [],
      Attribute: [],
      Attributes: [],
    };
  }

  processChildNode(node: parse5.ChildNode[], level: number) {
    this.funcs["ChildNode"].map((func) => {
      node = func.function(node, level);
    });
    return node;
  }

  processElement(node: parse5.Element, level: number): parse5.Element {
    this.funcs["ElementNode"].map((func) => {
      node = func.function(node, level);
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

  processAttributes(
    attribute: parse5.Attribute[],
    tagName: string,
    level: number
  ) {
    this.funcs["Attributes"].map(
      (func) => (attribute = func.function(attribute, tagName, level))
    );
    return attribute;
  }

  processAttribute(
    attribute: parse5.Attribute,
    tagName: string,
    level: number
  ) {
    this.funcs["Attribute"].map(
      (func) => (attribute = func.function(attribute, tagName, level))
    );
    return attribute;
  }
}

export const PluginManager = new PluginManagerClass();
