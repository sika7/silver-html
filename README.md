# @sika7/silver-html

```html
<div class="test" id="hoge">
  <div>test</div>
  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>
```

```html
<div class="test" id="hoge">
  <div>test</div>
  <ul>
  </ul>
</div>
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save @sika7/silver-html
```

**Step 2:** allow property config.

```js
import { silverHtml } from '@sika7/silver-html'

const plugin = {
  pluginName: "devToMain",
  Tag: (tagName) => "main"
}
const result = silverHtml("<div>test</div>", [plugin]);
console.log(result)
# <main>test</main>
```

## plugin

plugin config.
```js
{
  pluginName: 'pluginName'; // required.
  Elements?: (elements, level) => elements;
  Element?: (node, level) => node;
  Tag?: (tagName, level) => tagName;
  Attribute?: (attribute, tagName) => attribute;
  AttributeList?: (attributes, tagName) => attributes;
}
```

| setting       | description  | example | 
| ------------- | ------------ | ------- | 
| pluginName    | plugin name. |         | 
| Elements      |              |         | 
| Element       |              |         | 
| Tag           | tag name.    |         | 
| Attribute     |              |         | 
| AttributeList |              |         |


[official docs]: https://github.com/postcss/postcss#usage
