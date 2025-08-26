import { parse } from "meriyah";

export const setupNodes = parse(`
globalThis.XMLHttpRequest = { prototype: {} };
const window = Object.assign(Object.create(null), globalThis);
const document = {};
`).body || [
  {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "globalThis",
        },
        computed: false,
        property: {
          type: "Identifier",
          name: "XMLHttpRequest",
        },
        optional: false,
      },
      operator: "=",
      right: {
        type: "ObjectExpression",
        properties: [
          {
            type: "Property",
            key: {
              type: "Identifier",
              name: "prototype",
            },
            value: {
              type: "ObjectExpression",
              properties: [],
            },
            kind: "init",
            computed: false,
            method: false,
            shorthand: false,
          },
        ],
      },
    },
  },
  {
    type: "VariableDeclaration",
    kind: "const",
    declarations: [
      {
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
          name: "window",
        },
        init: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "Object",
            },
            computed: false,
            property: {
              type: "Identifier",
              name: "assign",
            },
            optional: false,
          },
          arguments: [
            {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "Object",
                },
                computed: false,
                property: {
                  type: "Identifier",
                  name: "create",
                },
                optional: false,
              },
              arguments: [
                {
                  type: "Literal",
                  value: null,
                },
              ],
              optional: false,
            },
            {
              type: "Identifier",
              name: "globalThis",
            },
          ],
          optional: false,
        },
      },
    ],
  },
  {
    type: "VariableDeclaration",
    kind: "const",
    declarations: [
      {
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
          name: "document",
        },
        init: {
          type: "ObjectExpression",
          properties: [],
        },
      },
    ],
  },
];
