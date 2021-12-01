export interface TagFunc {
  (tagName: string, level: number): string;
}

export interface ElementFunc {
  (node: silverHtmlElement, level: number): any;
}

export interface ElementsFunc {
  (elements: any[], level: number): any[];
}

export interface AttributeFunc {
  (attribute: silverHtmlAttribute, tagName: string): silverHtmlAttribute;
}

export interface AttributeListFunc {
  (attributes: silverHtmlAttribute[], tagName: string): silverHtmlAttribute[];
}

export interface CommentFunc {
  (comment: string, elements: string): string;
}

export interface silverHtmlElement {
  nodeName: string;
  tagName?: string;
  attrs?: silverHtmlAttribute[];
  childNodes?: silverHtmlElement[];
}

export interface silverHtmlAttribute {
  name: string;
  value: string;
}

export interface silverHtmlPlugin {
  pluginName: string;
  Comment?: CommentFunc;
  Elements?: ElementsFunc;
  Element?: ElementFunc;
  Tag?: TagFunc;
  Attribute?: AttributeFunc;
  AttributeList?: AttributeListFunc;
}

export interface silverHtmlConfig {}
