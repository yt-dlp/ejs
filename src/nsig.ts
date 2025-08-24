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
    params: [{}],
    body: {
      type: "BlockStatement",
      body: [
        {
          type: "ReturnStatement",
          // {
          argument:
            // or: [
            {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  // XXX: get switch function identifier, use here
                  // name: "Lb",
                },
                property: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    // XXX: get global string store identifier, use here
                    // name: "Y",
                  },
                  property: {
                    type: "NumericLiteral",
                  },
                },
              },
              arguments: [
                { type: "ThisExpression" },
                { type: "NumericLiteral" },
                {
                  type: "Identifier",
                  // XXX: get parameter name, use here
                  // name: "Y",
                },
              ],
            },
          // XXX: possible to be a direct call, ignore that for now
          // {
          //   type: "CallExpression",
          //   callee: {
          //     type: "Identifier",
          //     // XXX: get global string store identifier, use here
          //     // name: "Y",
          //   },
          //   arguments: [
          //     { type: "NumericLiteral" },
          //     {
          //       type: "Identifier",
          //       // XXX: get parameter name, use here
          //       // name: "Y",
          //     },
          //   ],
          // },
          // ],
          // },
        },
      ],
    },
  },
};

export function extract(node: Node): ArrowFunctionExpression | null {
  if (!matchesStructure(node, identifier)) {
    return null;
  }
  if (node.type !== "AssignmentExpression" || node.left.type !== "Identifier") {
    return null;
  }
  // TODO: verify identifiers here
  return {
    type: "ArrowFunctionExpression",
    params: [
      {
        type: "Identifier",
        name: "nsig",
      },
    ],
    async: false,
    expression: true,
    body: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: node.left.name,
      },
      arguments: [
        {
          type: "Identifier",
          name: "nsig",
        },
      ],
    },
  };
}
