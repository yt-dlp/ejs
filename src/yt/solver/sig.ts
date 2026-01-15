import { type ESTree } from "meriyah";
import { matchesStructure } from "../../utils.ts";
import { type DeepPartial } from "../../types.ts";

const nsigExpression: DeepPartial<ESTree.Statement> = {
  type: "VariableDeclaration",
  kind: "var",
  declarations: [
    {
      type: "VariableDeclarator",
      init: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
        },
        arguments: [
          {
            type: "Literal",
          },
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "decodeURIComponent",
            },
          },
        ],
      },
    },
  ],
};

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

const identifier: DeepPartial<ESTree.Node> = {
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
    {
      type: "VariableDeclaration",
      declarations: {
        anykey: [
          {
            type: "VariableDeclarator",
            init: {
              type: "FunctionExpression",
              params: [{}, {}, {}],
            },
          },
        ],
      },
    },
  ],
} as const;

export function extract(
  node: ESTree.Node,
): ESTree.ArrowFunctionExpression | null {
  if (!matchesStructure(node, identifier)) {
    return null;
  }
  let block: ESTree.BlockStatement | undefined | null;
  if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "AssignmentExpression" &&
    node.expression.right.type === "FunctionExpression"
  ) {
    block = node.expression.right.body;
  } else if (node.type === "VariableDeclaration") {
    for (const decl of node.declarations) {
      if (
        decl.type === "VariableDeclarator" &&
        decl.init?.type === "FunctionExpression" &&
        decl.init?.params.length === 3
      ) {
        block = decl.init.body;
        break;
      }
    }
  } else if (node.type === "FunctionDeclaration") {
    block = node.body;
  } else {
    return null;
  }
  const relevantExpression = block?.body.at(-2);

  let call: ESTree.CallExpression | null = null;
  if (matchesStructure(relevantExpression!, logicalExpression)) {
    if (
      relevantExpression?.type !== "ExpressionStatement" ||
      relevantExpression.expression.type !== "LogicalExpression" ||
      relevantExpression.expression.right.type !== "SequenceExpression" ||
      relevantExpression.expression.right.expressions[0].type !==
        "AssignmentExpression" ||
      relevantExpression.expression.right.expressions[0].right.type !==
        "CallExpression"
    ) {
      return null;
    }
    call = relevantExpression.expression.right.expressions[0].right;
  } else if (
    relevantExpression?.type === "IfStatement" &&
    relevantExpression.consequent.type === "BlockStatement"
  ) {
    for (const n of relevantExpression.consequent.body) {
      if (!matchesStructure(n, nsigExpression)) {
        continue;
      }
      if (
        n.type !== "VariableDeclaration" ||
        n.declarations[0].init?.type !== "CallExpression"
      ) {
        continue;
      }
      call = n.declarations[0].init;
      break;
    }
  }
  if (call === null) {
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
