export interface TagFunc {
  (tagName: string, level: number): string;
}

export interface ElementFunc {
  (node: any, level: number): any;
}

export interface ElementsFunc {
  (elements: any[], level: number): any[];
}

export interface AttributeFunc {
  (name: string, value: string, tagName: string): string;
}

export interface AttributeListFunc {
  (attributes: silverHtmlAttribute[], tagName: string): silverHtmlAttribute[];
}

export interface CommentFunc {
  (comment: string, elements: string): string;
}

export interface silverHtmlAttribute {
  name: string
  value: string
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

export interface silverHtmlConfig {
}
