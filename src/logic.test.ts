import * as parse5 from "parse5";
import { SilverHtmlConfig, SilverHtmlElement } from "./interface";
import {
  childElementNodes,
  elementNode,
  implementsParse5Elemtnt,
  parse5NodeAdapter,
  parseHtml,
  serializeNode,
  silverHtml,
} from "./logic";

const testConfig: SilverHtmlConfig = {};

describe("basic fucntion test.", () => {
  test("no change test.", () => {
    const result = silverHtml("<div>test</div>", testConfig, []);
    expect(result).toEqual("<div>test</div>");
  });

  test("basic fucntion throw new Error.", () => {
    expect(() =>
      silverHtml("<div>test</div>", testConfig, [
        {
          pluginName: "hoge",
          Element: () => {
            throw new Error("test error.");
          },
        },
      ])
    ).toThrow("hoge plugin error.");
  });

  test("run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Element: (e) => {
            e.tagName = "main"
            return e
          },
        },
      ]
    );
    expect(result).toEqual(
      "<main><main>test</main><main><main>list1</main><main>list2</main></main></main>"
    );
  });

  test("Elements run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          Elements: (elements: SilverHtmlElement[]) =>
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
          Element: (node: SilverHtmlElement) => {
            // if (node.tagName === "li") return null;
            // if (node.tagName === "ul") return null;
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

  test("test parseHtml function. for throw new Error", () => {
    expect(() => parseHtml(`<div>test</div><div>test</div>`, "hoge")).toThrow(
      "not found parser."
    );
  });

  test("tset serializeNode function.", () => {
    const test = parse5.parseFragment(`<div>test</div><div>test</div>`);
    const result = serializeNode(test);
    expect(result).toEqual(`<div>test</div><div>test</div>`);
  });

  test("tset serializeNode function. for throw new Error", () => {
    const test = parse5.parseFragment(`<div>test</div><div>test</div>`);
    expect(() => serializeNode(test, "hoge")).toThrow("not found serialize.");
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
                return node;
              });
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
