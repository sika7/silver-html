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
              name: "remove",
              function: () => {
                throw new Error("test error.");
              },
            },
          ],
        },
      ])
    ).toThrow("plugin: hoge Error: remove error.");
  });

  test("run test for ElementNode.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          ElementNode: [
            {
              name: "change tag",
              function: (e) => {
                e.tagName = "main";
                return e;
              },
            },
          ],
        },
      ]
    );
    expect(result).toEqual(
      "<main><main>test</main><main><main>list1</main><main>list2</main></main></main>"
    );
  });

  test("run test for attrs.", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          ElementNode: [
            {
              name: "hoge",
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
        },
      ]
    );
    expect(result).toEqual(
      '<div class="test" id="hoge"><div>test</div><ul><li>list1</li><li>list2</li></ul></div>'
    );
  });

  test("run test for Element if null", () => {
    const result = silverHtml(
      "<div><div>test</div><ul><li>list1</li><li>list2</li></ul></div>",
      testConfig,
      [
        {
          pluginName: "hoge",
          ElementNode: [
            {
              name: "hoge",
              function: (node) => {
                if (node.tagName === "li") return null;
                if (node.tagName === "ul") return null;
                return node;
              },
            },
          ],
        },
      ]
    );
    expect(result).toEqual("<div><div>test</div></div>");
  });

  test("run test for commentNode.", () => {
    const result = silverHtml(
      `
<div>
<!-- <div>test</div> -->
</div>`,
      testConfig,
      [
        {
          pluginName: "hoge",
          CommentNode: [
            {
              name: "eee",
              function: (e) => {
                return e;
              },
            },
          ],
        },
      ]
    );
    expect(result).toBe(`
<div>
<!-- <div>test</div> -->
</div>`);
  });

  test("run test for commentNode if null.", () => {
    const result = silverHtml(
      `
<div>
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
          CommentNode: [
            {
              name: "eee",
              function: () => {
                return null;
              },
            },
          ],
        },
      ]
    );
    expect(result).toBe(`
<div>
  <div>test</div>

  <ul>
    <li>list1</li>
    <li>list2</li>
  </ul>
</div>`);
  });

  test("run test for commentNode throw new Error.", () => {
    expect(() =>
      silverHtml(
        `
<div>test</div>
<!-- <div>test</div> -->
                 `,
        testConfig,
        [
          {
            pluginName: "comment",
            CommentNode: [
              {
                name: "remove",
                function: () => {
                  throw new Error("test error.");
                },
              },
            ],
          },
        ]
      )
    ).toThrow("plugin: comment Error: remove error.");
  });
});
