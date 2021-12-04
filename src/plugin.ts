import {
  SilverHtmlPlugin,
  SilverHtmlPluginManager,
} from "interface";

import * as parse5 from "parse5";

class PluginManagerClass {
  name: string = "none";

  funcs: SilverHtmlPluginManager = {
    ChildNode: [],
    Element: [],
    Attribute: [],
    Attributes: [],
  };

  constructor() {}

  init(name: string, plugin: SilverHtmlPlugin) {
    this.name = name;

    // functions set
    const { ChildNode, Element, Attribute, Attributes } = plugin;
    if (ChildNode) this.funcs["ChildNode"] = ChildNode;
    if (Element) this.funcs["Element"] = Element;
    if (Attributes) this.funcs["Attributes"] = Attributes;
    if (Attribute) this.funcs["Attribute"] = Attribute;
    return this;
  }

  resetFunction() {
    this.funcs["ChildNode"] = [];
    this.funcs["Element"] = [];
    this.funcs["Attributes"] = [];
    this.funcs["Attribute"] = [];
  }

  processChildNode(node: parse5.ChildNode[], level: number) {
    this.funcs["ChildNode"].map((func) => {
      node = func.function(node, level)
    });
    return node
  }

  processElement(node: parse5.Element, level: number): parse5.Element {
    this.funcs["Element"].map((func) => {
      node = func.function(node, level)
    });
    return node
  }

  processAttributes(
    attribute: parse5.Attribute[],
    tagName: string,
    level: number
  ) {
    this.funcs["Attributes"].map((func) =>
      attribute = func.function(attribute, tagName, level)
    );
    return attribute
  }

  processAttribute(
    attribute: parse5.Attribute,
    tagName: string,
    level: number
  ) {
    this.funcs["Attribute"].map((func) =>
      attribute = func.function(attribute, tagName, level)
    );
    return attribute
  }
}

export const PluginManager = new PluginManagerClass();
