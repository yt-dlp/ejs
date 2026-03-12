import { type ESTree } from "meriyah";
import { generate } from "astring";
import { matchesStructure, generateArrowFunction } from "../../utils.ts";
import { type DeepPartial } from "../../types.ts";

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
          async: false,
        },
      },
    },
    {
      type: "FunctionDeclaration",
      async: false,
      id: { type: "Identifier" },
    },
    {
      type: "VariableDeclaration",
      declarations: {
        anykey: [
          {
            type: "VariableDeclarator",
            init: {
              type: "FunctionExpression",
              async: false,
            },
          },
        ],
      },
    },
  ],
} as const;

const asdasd: DeepPartial<ESTree.ExpressionStatement> = {
  type: "ExpressionStatement",
  expression: {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: { type: "Identifier" },
      property: {},
      optional: false,
    },
    arguments: [
      {
        type: "Literal",
        value: "alr",
      },
      {
        type: "Literal",
        value: "yes",
      },
    ],
    optional: false,
  },
};

export function extract(
  node: ESTree.Node,
): ESTree.ArrowFunctionExpression | null {
  if (!matchesStructure(node, identifier)) {
    return null;
  }

  const options: {
    name: ESTree.Expression;
    statements: ESTree.Statement[];
  }[] = [];

  if (node.type === "FunctionDeclaration") {
    if (node.id && node.body?.body) {
      options.push({
        name: node.id,
        statements: node.body?.body,
      });
    }
  } else if (node.type === "ExpressionStatement") {
    if (node.expression.type !== "AssignmentExpression") {
      return null;
    }
    const name = node.expression.left;
    const body = (node.expression.right as ESTree.FunctionExpression)?.body
      ?.body;
    if (name && body) {
      options.push({
        name: name,
        statements: body,
      });
    }
  } else if (node.type === "VariableDeclaration") {
    for (const declaration of node.declarations) {
      const name = declaration.id;
      const body = (declaration.init as ESTree.FunctionExpression)?.body?.body;
      if (name && body) {
        options.push({
          name: name,
          statements: body,
        });
      }
    }
  }

  for (const { name, statements } of options) {
    if (matchesStructure(statements, { anykey: [asdasd] })) {
      return createSolver(name);
    }
  }
  return null;
}

function createSolver(
  expression: ESTree.Expression,
): ESTree.ArrowFunctionExpression {
  return generateArrowFunction(`
({sig, n}) => {
  const url = (${generate(expression)})("https://youtube.com/watch?v=yt-dlp-wins", "s", sig);
  url.set("n", n);
  const proto = Object.getPrototypeOf(url);
  const keys = Object.keys(proto).concat(Object.getOwnPropertyNames(proto));
  for (const key of keys) {
    if (!["constructor", "set", "get", "clone"].includes(key)) {
      url[key]();
      break;
    }
  }
  const s = url.get("s");
  return {
    sig: s ? decodeURIComponent(s) : null,
    n: url.get("n") ?? null,
  };
}
`);
}
