import { type ESTree } from "meriyah";
import { matchesStructure } from "../../utils.ts";
import { generate } from "astring";
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
): { expression: ESTree.ArrowFunctionExpression; name: string } | null {
  const blocks: { body: ESTree.BlockStatement; params: string[]; name: string }[] =
    [];

  if (matchesStructure(node, identifier)) {
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "AssignmentExpression" &&
      node.expression.right.type === "FunctionExpression" &&
      node.expression.right.params.length === 3
    ) {
      blocks.push({
        name: generate(node.expression.left),
        body: node.expression.right.body as ESTree.BlockStatement,
        params: node.expression.right.params
          .filter((p): p is ESTree.Identifier => p.type === "Identifier")
          .map((p) => p.name),
      });
    } else if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        if (
          decl.init?.type === "FunctionExpression" &&
          decl.init.params.length === 3
        ) {
          const name = decl.id.type === "Identifier" ? decl.id.name : "?";
          blocks.push({
            name,
            body: decl.init.body as ESTree.BlockStatement,
            params: decl.init.params
              .filter((p): p is ESTree.Identifier => p.type === "Identifier")
              .map((p) => p.name),
          });
        }
      }
    } else if (node.type === "FunctionDeclaration" && node.params.length === 3) {
      const name = node.id?.name || "?";
      blocks.push({
        name,
        body: node.body as ESTree.BlockStatement,
        params: node.params
          .filter((p): p is ESTree.Identifier => p.type === "Identifier")
          .map((p) => p.name),
      });
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
        blocks.push({
          name: generate(expr.left),
          body: expr.right.body as ESTree.BlockStatement,
          params: expr.right.params
            .filter((p): p is ESTree.Identifier => p.type === "Identifier")
            .map((p) => p.name),
        });
      }
    }
  } else {
    return null;
  }

  for (const { body: block, params, name: funcName } of blocks) {
    let call: ESTree.CallExpression | null = null;
    let sigVarName: string | null = null;

    const thirdParam = params[2];

    for (const stmt of block.body) {
      if (matchesStructure(stmt, logicalExpression)) {
        if (
          stmt.type === "ExpressionStatement" &&
          stmt.expression.type === "LogicalExpression" &&
          stmt.expression.right.type === "SequenceExpression" &&
          stmt.expression.right.expressions[0].type === "AssignmentExpression" &&
          stmt.expression.right.expressions[0].right.type === "CallExpression"
        ) {
          call = stmt.expression.right.expressions[0].right;
          if (stmt.expression.left.type === "Identifier") {
            sigVarName = stmt.expression.left.name;
          }
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

    const name = call.callee.name;
    const targetParam = sigVarName || thirdParam;

    let usesSig = false;
    let args = call.arguments.map((arg): ESTree.Expression => {
      if (targetParam && arg.type === "Identifier" && arg.name === targetParam) {
        usesSig = true;
        return { type: "Identifier", name: "sig" };
      }
      if (
        targetParam &&
        arg.type === "CallExpression" &&
        arg.callee.type === "Identifier" &&
        arg.callee.name === "decodeURIComponent" &&
        arg.arguments[0]?.type === "Identifier" &&
        arg.arguments[0].name === targetParam
      ) {
        usesSig = true;
        return {
          type: "CallExpression",
          callee: { type: "Identifier", name: "decodeURIComponent" },
          arguments: [{ type: "Identifier", name: "sig" }],
          optional: false,
        };
      }
      return arg as unknown as ESTree.Expression;
    });

    if (!usesSig) {
      args =
        call.arguments.length === 1
          ? [
              {
                type: "Identifier",
                name: "sig",
              },
            ]
          : [
              call.arguments[0] as unknown as ESTree.Expression,
              {
                type: "Identifier",
                name: "sig",
              },
            ];
    }

    // TODO: verify identifiers here
    return {
      name: funcName,
      expression: {
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
            name,
          },
          arguments: args,
          optional: false,
        },
        async: false,
        expression: false,
        generator: false,
      },
    };
  }

  return null;
}