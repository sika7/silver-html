import * as parse5 from 'parse5'

export interface ElementFunction {
  name: string;
  function: (node: parse5.Element, level: number) => parse5.Element | null;
}

export interface TextFunction {
  name: string;
  function: (node: parse5.TextNode, level: number) => parse5.TextNode | null;
}

export interface CommentFunction {
  name: string;
  function: (node: parse5.CommentNode, level: number) => parse5.CommentNode | null;
}

export interface SilverHtmlPluginManager {
  CommentNode: CommentFunction[];
  TextNode: TextFunction[];
  ElementNode: ElementFunction[];
}

export interface SilverHtmlPlugin {
  pluginName: string,
  CommentNode?: CommentFunction[];
  TextNode?: TextFunction[];
  ElementNode?: ElementFunction[];
}

export interface SilverHtmlConfig {}
