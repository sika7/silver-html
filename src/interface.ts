export interface ElementFunc {
  (element: string, level: number): string;
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
  Element?: ElementFunc;
  Attribute?: AttributeFunc;
}
