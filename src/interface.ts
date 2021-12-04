import * as parse5 from 'parse5'

export interface ElementFunc {
  (node: SilverHtmlElement, level: number): SilverHtmlElement;
}

export interface ElementsFunc {
  (elements: SilverHtmlElement[], level: number): SilverHtmlElement[];
}

export interface AttributeFunc {
  (attribute: SilverHtmlAttribute, tagName: string): SilverHtmlAttribute;
}

export interface AttributeListFunc {
  (attributes: SilverHtmlAttribute[], tagName: string): SilverHtmlAttribute[];
}

export interface CommentFunc {
  (comment: string, elements: string): string;
}

export type SilverHtmlElement = parse5.Element

export type SilverHtmlAttribute = parse5.Attribute

export type SilverHtmlNode = parse5.Node
export type SilverHtmlChildNode = parse5.ChildNode

export interface SilverHtmlPlugin {
  pluginName: string;
  // Comment?: CommentFunc;
  Elements?: ElementsFunc;
  Element?: ElementFunc;
  Attribute?: AttributeFunc;
  AttributeList?: AttributeListFunc;
}

export interface SilverHtmlConfig {}
