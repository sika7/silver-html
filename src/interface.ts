import * as parse5 from 'parse5'

export interface ChildNodeFunction {
  name: string;
  function: (elements: parse5.ChildNode[], level: number) => parse5.ChildNode[];
}

export interface ElementFunction {
  name: string;
  function: (node: parse5.Element, level: number) => parse5.Element;
}

export interface TextFunction {
  name: string;
  function: (node: parse5.TextNode, level: number) => parse5.TextNode;
}

export interface CommentFunction {
  name: string;
  function: (node: parse5.CommentNode, level: number) => parse5.CommentNode;
}

export interface AttributeFunction {
  name: string;
  function: (attribute: parse5.Attribute, tagName: string, level: number) => parse5.Attribute;
}

export interface AttributesFunction {
  name: string;
  function: (attributes: parse5.Attribute[], tagName: string, level: number) => parse5.Attribute[];
}

export interface SilverHtmlPluginManager {
  ChildNode: ChildNodeFunction[];
  CommentNode: CommentFunction[];
  TextNode: TextFunction[];
  ElementNode: ElementFunction[];
  Attribute: AttributeFunction[];
  Attributes: AttributesFunction[];
}

export interface SilverHtmlPlugin {
  name: string,
  ChildNode?: ChildNodeFunction[];
  CommentNode?: CommentFunction[];
  TextNode?: TextFunction[];
  ElementNode?: ElementFunction[];
  Attribute?: AttributeFunction[];
  Attributes?: AttributesFunction[];
}

export interface SilverHtmlConfig {}
