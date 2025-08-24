import {
  type ArrowFunctionExpression,
  type Node,
} from "npm:@babel/types@7.28.2";
import { matchesStructure } from "./utils.ts";
import { type DeepPartial } from "./types.ts";

const identifier: DeepPartial<Node> = {
  type: "AssignmentExpression",
  operator: "=",
  left: {
    type: "Identifier",
  },
  right: {
    type: "FunctionExpression",
    params: [{}, {}, {}],
    body: {
      type: "BlockStatement",
      body: [
        { type: "ExpressionStatement" },
        { type: "ExpressionStatement" },
        { type: "ExpressionStatement" },
        { type: "ExpressionStatement" },
        {
          type: "ExpressionStatement",
          expression: {
            type: "LogicalExpression",
            left: {
              type: "Identifier",
              // name: "M",
            },
            operator: "&&",
            right: {
              type: "SequenceExpression",
              expressions: [
                {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                  },
                  right: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                    },
                    arguments: [
                      { type: "NumericLiteral" },
                      {
                        type: "CallExpression",
                        callee: {
                          type: "Identifier",
                          name: "decodeURIComponent",
                        },
                        arguments: [{ type: "Identifier" }],
                      },
                    ],
                  },
                },
                {
                  type: "CallExpression",
                },
              ],
              extra: {
                parenthesized: true,
              },
            },
          },
        },
        { type: "ReturnStatement" },
      ],
    },
  },
};

export function extract(node: Node): ArrowFunctionExpression | null {
  if (!matchesStructure(node, identifier)) {
    return null;
  }
  // shut the type checker up
  if (
    node.type !== "AssignmentExpression" ||
    node.right.type !== "FunctionExpression" ||
    node.right.body.body[4].type !== "ExpressionStatement" ||
    node.right.body.body[4].expression.type !== "LogicalExpression" ||
    node.right.body.body[4].expression.right.type !== "SequenceExpression" ||
    node.right.body.body[4].expression.right.expressions[0].type !==
      "AssignmentExpression"
  ) {
    return null;
  }
  const call = node.right.body.body[4].expression.right.expressions[0].right;
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
    async: false,
    expression: true,
    body: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: call.callee.name,
      },
      arguments: [
        call.arguments[0],
        {
          type: "Identifier",
          name: "sig",
        },
      ],
    },
  };
}
