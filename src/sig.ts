import { type ESTree } from "meriyah";
import { matchesStructure } from "./utils.ts";
import { type DeepPartial } from "./types.ts";

const logicalExpression: DeepPartial<ESTree.ExpressionStatement> = {
  type: "ExpressionStatement",
  expression: {
    type: "LogicalExpression",
    left: {
      type: "Identifier",
    },
    right: {
      type: "SequenceExpression",
      expressions: [
        {
          type: "AssignmentExpression",
          left: {
            type: "Identifier",
          },
          operator: "=",
          right: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
            },
            arguments: {
              or: [
                [
                  { type: "Literal" },
                  {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "decodeURIComponent",
                    },
                    arguments: [{ type: "Identifier" }],
                    optional: false,
                  },
                ],
                [
                  {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "decodeURIComponent",
                    },
                    arguments: [{ type: "Identifier" }],
                    optional: false,
                  },
                ],
              ],
            },
            optional: false,
          },
        },
        {
          type: "CallExpression",
        },
      ],
    },
    operator: "&&",
  },
};

const identifier = {
  or: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "=",
        left: {
          type: "Identifier",
        },
        right: {
          type: "FunctionExpression",
          params: [{}, {}, {}],
        },
      },
    },
    {
      type: "FunctionDeclaration",
      params: [{}, {}, {}],
    },
  ],
} as const;

export function extract(
  node: ESTree.Node,
): ESTree.ArrowFunctionExpression | null {
  if (
    !matchesStructure(node, identifier as unknown as DeepPartial<ESTree.Node>)
  ) {
    return null;
  }
  const block =
    node.type === "ExpressionStatement" &&
    node.expression.type === "AssignmentExpression" &&
    node.expression.right.type === "FunctionExpression"
      ? node.expression.right.body
      : node.type === "FunctionDeclaration"
        ? node.body
        : null;
  const relevantExpression = block?.body.at(-2);
  if (!matchesStructure(relevantExpression!, logicalExpression)) {
    return null;
  }
  if (
    relevantExpression?.type !== "ExpressionStatement" ||
    relevantExpression.expression.type !== "LogicalExpression" ||
    relevantExpression.expression.right.type !== "SequenceExpression" ||
    relevantExpression.expression.right.expressions[0].type !==
      "AssignmentExpression"
  ) {
    return null;
  }
  const call = relevantExpression.expression.right.expressions[0].right;
  if (call.type !== "CallExpression" || call.callee.type !== "Identifier") {
    return null;
  }
  // TODO: verify identifiers here
  return {
    type: "ArrowFunctionExpression",
    params: [
      {
        type: "Identifier",
        name: "sig",
      },
    ],
    body: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: call.callee.name,
      },
      arguments:
        call.arguments.length === 1
          ? [
              {
                type: "Identifier",
                name: "sig",
              },
            ]
          : [
              call.arguments[0],
              {
                type: "Identifier",
                name: "sig",
              },
            ],
      optional: false,
    },
    async: false,
    expression: false,
    generator: false,
  };
}
