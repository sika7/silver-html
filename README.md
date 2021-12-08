# @sika7/silver-html

this package is Can be recursively deleted or modified. for CommentNode and TextNode and ElementNode.

## Usage

**Step 1:** Install plugin:

```sh
npm install --save @sika7/silver-html
```

**Step 2:** add a functions or plugin.

[use example more](./docs/index.md)

```js
import { silverHtml } from '@sika7/silver-html'

const plugin = {
  pluginName: "devToMain",
  ElementNode: [
    {
      name: "all change tag for main",
      function: (element) => {
        element.tagName = "main";
        return element;
      },
    },
  ],
}
const result = silverHtml("<div>test</div>", {}, [plugin]);
console.log(result)
# <main>test</main>
```

## plugin

plugin config.
```js
const plugin = {
  pluginName: 'pluginName'; // required.
  ElementNode?: (node, level)    => node | null;
  CommentNode?: (comment, level) => node | null;
  TextNode?: (text, level)       => node | null;
}
```

| setting     | description                                    |     | 
| ----------- | ---------------------------------------------- | --- | 
| pluginName  | plugin name.                                   |     | 
| ElementNode | When creating recursive processing of elements |     | 
| CommentNode | When creating recursive processing of comment  |     | 
| TextNode    | When creating recursive processing of text     |     | 

