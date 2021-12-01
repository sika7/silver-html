import silverHtml from "./logic"

console.log(new silverHtml([{
  pluginName: 'aaa',
  Tag: (tag, level) => {
    // console.log(tag, level);
    if (tag === 'dev') return 'hoge'
    return tag
    // return 'hoge'
  },
  Elements: (elements, level) => {
    return elements.filter(a => a.nodeName !== "#text")
  }
}]).process('<div><div><div>test</div><p>test</p></div><script>alert("ok");</script>'))
