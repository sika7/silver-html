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
  (name: string, value: string, elements: string): string;
}

export interface CommentFunc {
  (comment: string, elements: string): string;
}

export interface silverHtmlPlugin {
  pluginName: string;
  Comment?: CommentFunc;
  Elements?: ElementsFunc;
  Element?: ElementFunc;
  Tag?: ElementFunc;
  Attribute?: AttributeFunc;
}
