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
  const blocks: ESTree.BlockStatement[] = [];

  if (matchesStructure(node, identifier)) {
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "AssignmentExpression" &&
      node.expression.right.type === "FunctionExpression" &&
      node.expression.right.params.length === 3
    ) {
      blocks.push(node.expression.right.body!);
    } else if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (
          decl.init?.type === "FunctionExpression" &&
          decl.init.params.length === 3
        ) {
          blocks.push(decl.init.body!);
        }
      }
    } else if (
      node.type === "FunctionDeclaration" &&
      node.params.length === 3
    ) {
      blocks.push(node.body!);
    } else {
      return null;
    }
  } else if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "SequenceExpression"
  ) {
    for (const expr of node.expression.expressions) {
      if (
        expr.type === "AssignmentExpression" &&
        expr.right.type === "FunctionExpression" &&
        expr.right.params.length === 3
      ) {
        blocks.push(expr.right.body as ESTree.BlockStatement);
      }
    }
  } else {
    return null;
  }

  for (const block of blocks) {
    let call: ESTree.CallExpression | null = null;

    for (const stmt of block.body) {
      if (matchesStructure(stmt, logicalExpression)) {
        if (
          stmt.type === "ExpressionStatement" &&
          stmt.expression.type === "LogicalExpression" &&
          stmt.expression.right.type === "SequenceExpression" &&
          stmt.expression.right.expressions[0].type ===
            "AssignmentExpression" &&
          stmt.expression.right.expressions[0].right.type === "CallExpression"
        ) {
          call = stmt.expression.right.expressions[0].right;
          break;
        }
      } else if (stmt.type === "IfStatement") {
        let consequent = stmt.consequent;
        while (consequent.type === "LabeledStatement") {
          consequent = consequent.body;
        }

        if (consequent.type === "BlockStatement") {
          for (const n of consequent.body) {
            if (!matchesStructure(n, nsigExpression)) {
              continue;
            }

            if (
              n.type === "VariableDeclaration" &&
              n.declarations[0]?.init?.type === "CallExpression"
            ) {
              call = n.declarations[0].init;
              break;
            }
          }
        }
        if (call) break;
      }
    }

    if (call?.callee.type !== "Identifier") {
      continue;
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
        arguments: call.arguments.map((arg): ESTree.Expression => {
          if (
            arg.type === "CallExpression" &&
            arg.callee.type === "Identifier" &&
            arg.callee.name === "decodeURIComponent" &&
            arg.arguments[0]?.type === "Identifier"
          ) {
            return { type: "Identifier", name: "sig" };
          }
          return arg as unknown as ESTree.Expression;
        }),
        optional: false,
      },
      async: false,
      expression: false,
      generator: false,
    };
  }

  return null;
}
