import silverHtml from "./logic"

console.log(new silverHtml([{
  pluginName: 'aaa',
  Element: (elements, level) => {
    console.log(elements, level);
    if (elements === 'dev') return 'hoge'
    return elements
    // return 'hoge'
  },
}]).process('<div><div><div>test</div><p>test</p></div><script>alert("ok");</script>'))
