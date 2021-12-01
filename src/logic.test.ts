import * as parse5 from "parse5";
import { silverHtmlConfig } from "./interface";
import {
  childElementNodes,
  elementNode,
  implementsParse5Elemtnt,
  parse5NodeAdapter,
  parseHtml,
  serializeNode,
  silverHtml,
} from "./logic";

const testConfig: silverHtmlConfig = {};

describe("basic fucntion test.", () => {
  test("no change test.", () => {
    const result = silverHtml("<div>test</div>", testConfig, []);
    expect(result).toEqual("<div>test</div>");
  });

  test("run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Tag: () => "main",
        },
      ]
    );
    expect(result).toEqual(
      "<main><main>test</main><main><main>list1</main><main>list2</main></main></main>"
    );
  });

  test("Tag run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Tag: (tagName) => {
            if (tagName === "li") return "a";
            if (tagName === "ul") return "p";
            return tagName;
          },
        },
      ]
    );
    expect(result).toEqual(
      "<div><div>test</div><p><a>list1</a><a>list2</a></p></div>"
    );
  });

  test("Elements run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Elements: (elements) =>
            elements.filter((node) => node.tagName !== "li"),
        },
      ]
    );
    expect(result).toEqual("<div><div>test</div><ul></ul></div>");
  });

  test("Element run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Element: (node, level) => {
            if (level === 1) {
              node.attrs = [
                { name: "class", value: "test" },
                { name: "id", value: "hoge" },
              ];
            }
            return node;
          },
        },
      ]
    );
    expect(result).toEqual(
      '<div class="test" id="hoge"><div>test</div><ul><li>list1</li><li>list2</li></ul></div>'
    );
  });

  test("Element run test. if null", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Element: (node) => {
            if (node.tagName === "li") return null;
            if (node.tagName === "ul") return null;
            return node;
          },
        },
      ]
    );
    expect(result).toEqual("<div><div>test</div></div>");
  });

  test("Attribute run test.", () => {
    const result = silverHtml(
      '<div><div class="js-ok">test</div><ul><li>list1</li><li>list2</li></ul></div>',
      testConfig,
      [
        {
          pluginName: "hoge",
          Attribute: (attribute) => {
            if (attribute.name) attribute.name = "id";
            return attribute;
          },
          // AttributeList: (attributes) => attributes,
        },
      ]
    );
    expect(result).toEqual(
      '<div><div id="js-ok">test</div><ul><li>list1</li><li>list2</li></ul></div>'
    );
  });

  test("AttributeList run test.", () => {
    const result = silverHtml(
      '<div><div class="js-ok">test</div><ul><li>list1</li><li>list2</li></ul></div>',
      testConfig,
      [
        {
          pluginName: "hoge",
          AttributeList: (attributes) =>
            attributes.filter((attr) => attr.value !== "js-ok"),
        },
      ]
    );
    expect(result).toEqual(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>"
    );
  });
});

function parse5Node(html: string, testFunc: Function) {
  let node = parse5.parseFragment(html);
  node = testFunc(node);
  return parse5.serialize(node);
}

describe("internal function test.", () => {
  test("parse5 parse node. test parseHtml function.", () => {
    const result = parseHtml(`<div>test</div><div>test</div>`);
    const test = parse5.parseFragment(`<div>test</div><div>test</div>`);
    expect(result).toEqual(test);
  });

  test("parse5 parse node. test parseHtml function.", () => {
    const test = parse5.parseFragment(`<div>test</div><div>test</div>`);
    const result = serializeNode(test);
    expect(result).toEqual(`<div>test</div><div>test</div>`);
  });

  test("parse5NodeAdapter.", () => {
    const result = parse5Node(`<div>test</div>`, (node: parse5.ChildNode) => {
      return parse5NodeAdapter(
        node,
        {
          pluginName: "hoge",
          Tag: () => "hoge",
        },
        0
      );
    });
    expect(result).toEqual("<hoge>test</hoge>");
  });

  test("test elementNode function.", () => {
    const result = parse5Node(`<div>test</div>`, (node: parse5.ChildNode) => {
      return elementNode(
        node,
        {
          pluginName: "hoge",
          Tag: () => "hoge",
        },
        0
      );
    });
    expect(result).toEqual("<hoge>test</hoge>");
  });

  test("test implementsParse5Elemtnt function.", () => {
    const result = silverHtml(
      `<div>
  <div>test</div>
  <!-- <div>test</div> -->
  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>`,
      testConfig,
      [
        {
          pluginName: "hoge",
          Elements: (e) => {
            return e
              .map((node) => {
                if (implementsParse5Elemtnt(node)) {
                  return node;
                }
                return null;
              })
              .filter((node) => node !== null);
          },
        },
      ]
    );
    expect(result).toBe("<div><div></div><ul><li></li><li></li></ul></div>");
  });

  test("test childElementNodes function.", () => {
    const result = parse5Node(
      `<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>`,
      (node: parse5.ChildNode) => {
        if (implementsParse5Elemtnt(node)) {
          node.childNodes = childElementNodes(
            node.childNodes,
            {
              pluginName: "hoge",
              Elements: (e) => e.filter((node) => node.tagName !== "li"),
            },
            0
          );
        }
        return node;
      }
    );
    expect(result).toBe("<div><div>test</div><ul></ul></div>");
  });
});
