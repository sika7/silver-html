import * as parse5 from "parse5";
import { SilverHtmlConfig } from "./interface";
import { silverHtml } from "./logic";

const testConfig: SilverHtmlConfig = {};

describe("basic fucntion test.", () => {
  test("no change test.", () => {
    const result = silverHtml(
      '<div><div class="test">test</div><div>test</div></div>',
      testConfig,
      []
    );
    expect(result).toEqual(
      '<div><div class="test">test</div><div>test</div></div>'
    );
  });

  test("basic fucntion throw new Error.", () => {
    expect(() =>
      silverHtml("<div>test</div>", testConfig, [
        {
          pluginName: "hoge",
          ElementNode: [
            {
              name: 'remove',
              function: () => {
                throw new Error("test error.");
              },
            }
          ],
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
          ElementNode: [
            {
              name: 'aaa',
              function: (e) => {
                e.tagName = "main";
                return e;
              }
            }
          ],
        },
      ]
    );
    expect(result).toEqual(
      "<main><main>test</main><main><main>list1</main><main>list2</main></main></main>"
    );
  });

  test("Element run test.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          ElementNode: [
            {
              name: 'hoge',
              function: (node, level) => {
                if (level === 1) {
                  node.attrs = [
                    { name: "class", value: "test" },
                    { name: "id", value: "hoge" },
                  ];
                }
                return node;
              },
            }
          ]
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
          ElementNode: [
            {
              name: 'hoge',
              function: (node) => {
                // if (node.tagName === "li") return null;
                // if (node.tagName === "ul") return null;
                return node;
              }
            }
          ],
        },
      ]
    );
    expect(result).toEqual("<div><div>test</div></div>");
  });
});

function parse5Node(html: string, testFunc: Function) {
  let node = parse5.parseFragment(html);
  node = testFunc(node);
  return parse5.serialize(node);
}

describe("internal function test.", () => {
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
          ElementNode: [
            {
              name: 'eee',
              function: (e) => {
                return e;
              }
            }
          ],
        },
      ]
    );
    expect(result).toBe("<div><div></div><ul><li></li><li></li></ul></div>");
  });
});
