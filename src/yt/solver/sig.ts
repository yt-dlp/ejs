import { type ESTree } from "meriyah";
import { matchesStructure } from "../../utils.ts";
import { type DeepPartial } from "../../types.ts";

const nsig: DeepPartial<ESTree.CallExpression> = {
  type: "CallExpression",
  callee: {
    or: [{ type: "Identifier" }, { type: "SequenceExpression" }],
  },
  arguments: [
    {},
    {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "decodeURIComponent",
      },
      arguments: [{}],
    },
  ],
};
const nsigAssignment: DeepPartial<ESTree.AssignmentExpression> = {
  type: "AssignmentExpression",
  left: { type: "Identifier" },
  operator: "=",
  right: nsig,
};
const nsigDeclarator: DeepPartial<ESTree.VariableDeclarator> = {
  type: "VariableDeclarator",
  id: { type: "Identifier" },
  init: nsig,
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
                  { type: "Literal" },
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
          or: [{ type: "Identifier" }, { type: "MemberExpression" }],
        },
        right: {
          type: "FunctionExpression",
        },
      },
    },
    {
      type: "FunctionDeclaration",
    },
    {
      type: "VariableDeclaration",
      declarations: {
        anykey: [
          {
            type: "VariableDeclarator",
            init: {
              type: "FunctionExpression",
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
      node.expression.right.params.length >= 3
    ) {
      blocks.push(node.expression.right.body!);
    } else if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (
          decl.init?.type === "FunctionExpression" &&
          decl.init.params.length >= 3
        ) {
          blocks.push(decl.init.body!);
        }
      }
    } else if (node.type === "FunctionDeclaration" && node.params.length >= 3) {
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
        // legacy matching
        if (
          stmt.type === "ExpressionStatement" &&
          stmt.expression.type === "LogicalExpression" &&
          stmt.expression.right.type === "SequenceExpression" &&
          stmt.expression.right.expressions[0].type ===
            "AssignmentExpression" &&
          stmt.expression.right.expressions[0].right.type === "CallExpression"
        ) {
          call = stmt.expression.right.expressions[0].right;
        }
      } else if (stmt.type === "IfStatement") {
        // if (...) { var a, b = (0, c)(1, decodeURIComponent(...))}
        let consequent = stmt.consequent;
        while (consequent.type === "LabeledStatement") {
          consequent = consequent.body;
        }
        if (consequent.type !== "BlockStatement") {
          continue;
        }

        for (const n of consequent.body) {
          if (n.type !== "VariableDeclaration") {
            continue;
          }
          for (const decl of n.declarations) {
            if (
              matchesStructure(decl, nsigDeclarator) &&
              decl.init?.type === "CallExpression"
            ) {
              call = decl.init;
              break;
            }
          }
          if (call) {
            break;
          }
        }
      } else if (stmt.type === "ExpressionStatement") {
        // (...) && ((...), (c = (...)(decodeURIComponent(...))))
        if (
          stmt.expression.type !== "LogicalExpression" ||
          stmt.expression.operator !== "&&" ||
          stmt.expression.right.type !== "SequenceExpression"
        ) {
          continue;
        }
        for (const expr of stmt.expression.right.expressions) {
          if (matchesStructure(expr, nsigAssignment) && expr.type) {
            if (
              expr.type === "AssignmentExpression" &&
              expr.right.type === "CallExpression"
            ) {
              call = expr.right;
              break;
            }
          }
        }
      }
      if (call) {
        break;
      }
    }

    if (!call) {
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
        callee: call.callee,
        arguments: call.arguments.map((arg): ESTree.Expression => {
          if (
            arg.type === "CallExpression" &&
            arg.callee.type === "Identifier" &&
            arg.callee.name === "decodeURIComponent"
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
