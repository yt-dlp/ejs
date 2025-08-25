import { type Node } from "@babel/types";

export const setupNodes: Node[] = [
  {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
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
      },
      right: {
        type: "ObjectExpression",
        properties: [
          {
            type: "ObjectProperty",
            method: false,
            key: {
              type: "Identifier",
              name: "prototype",
            },
            computed: false,
            shorthand: false,
            value: {
              type: "ObjectExpression",
              properties: [],
            },
          },
        ],
      },
    },
  },
  {
    type: "VariableDeclaration",
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
              },
              arguments: [
                {
                  type: "NullLiteral",
                },
              ],
            },
            {
              type: "Identifier",
              name: "globalThis",
            },
          ],
        },
      },
    ],
    kind: "const",
  },
  {
    type: "VariableDeclaration",
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
    kind: "const",
  },
];
