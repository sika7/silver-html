import silverHtml from "./logic";

console.log(
  new silverHtml([
    {
      pluginName: "aaa",
      Tag: (tag, level) => {
        // console.log(tag, level);
        if (tag === "dev") return "hoge";
        return tag;
      },
      AttributeList: (attributes, tagName) => {
        console.log(attributes);
        // if (Array.isArray(attributes))
        return attributes.filter((attribute) => attribute.name === "class");
      },
    },
  ]).process(
    '<div><div class="hoge" id="hogehoge"><div>test</div><p>test</p></div><script>alert("ok");</script>'
  )
);
