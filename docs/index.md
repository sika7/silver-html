# use example

## ElementNode

### change tag

```javascript
const plugin = {
  pluginName: "plugin name",
  ElementNode: [
    {
      name: "change tag",
      function: (e, level) => {
        if (level === 1 && e.tagName === 'dev') e.tagName = "main";
        return e;
      },
    },
  ],
}
```

```html
# import
<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
# export
<main><div>test</div><ul><li>list1</li><li>list2</li></ul></main>
```

### remove tag

```javascript
const plugin = {
  pluginName: "hoge",
  ElementNode: [
    {
      name: "move tag for li",
      function: (e, level) => {
        if (e.tagName === 'li') return;
        return e;
      },
    },
  ],
}
```

```html
# import
<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
# export
<div><div>test</div><ul></ul></div>
```

### add attrs

```javascript
const plugin = {
  pluginName: "hoge",
  ElementNode: [
    {
      name: "add attrs for level 1",
      function: (node, level) => {
        if (level === 1) {
          node.attrs = [
            { name: "class", value: "test" },
            { name: "id", value: "hoge" },
          ];
        }
        return node;
      },
    },
  ],
}
```

```html
# import
<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
# export
<div class="test" id="hoge"><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
```

### change attrs

```javascript
const plugin = {
  pluginName: "hoge",
  ElementNode: [
    {
      name: "change attrs for class 'test'.",
      function: (node, level) => {
        node.attrs = node.attrs.map(attr => {
          if (attr.name === 'class' && attr.value === 'test') attr.value = 'hoge'
          return attr
        })
        return node;
      },
    },
  ],
}
```

```html
# import
<div class="test" id="hoge"><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
# export
<div class="hoge" id="hoge"><div>test</div><ul><li>list1</li><li>list2</li></ul></div>
```

## TextNode

### remove indention

```javascript
const plugin = {
  pluginName: "",
  TextNode: [
    {
      name: "move indention",
      function: (text) => {
        text.value = text.value.replace(/\r?\n/g, "");
        return text;
      },
    },
  ],
}
```

```html
# import
<div>
<div>test</div>
</div>
# export
<div><div>test</div></div>
```

### remove text

```javascript
const plugin = {
  pluginName: "",
  TextNode: [
    {
      name: "remove text",
      function: (text) => {
        if (text.value === "list1") return null;
        return text;
      },
    },
  ],
}
```

```html
# import
<div>
  <div>test</div>
  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>
# export
<div>
  <div>test</div>
  <ul>
    <li></li>
    <li>list2</li>
  </ul>
</div>
```

## CommentNode

### remove comment

```javascript
const plugin = {
  pluginName: "plugin name",
  CommentNode: [
    {
      name: "remove comment",
      function: () => {
        return null;
      },
    },
  ],
}
```

```html
# import
<div>
  <div>test</div>
<!-- <div>test</div> -->
  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>
# export
<div>
  <div>test</div>

  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>
```
