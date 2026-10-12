import { generate } from "astring";
import { type ESTree } from "meriyah";

import { type DeepPartial } from "../../types.ts";
import { matchesStructure, generateArrowFunction } from "../../utils.ts";

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

const split: DeepPartial<ESTree.CallExpression> = {
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    property: { type: "Identifier", name: "split" },
    object: { type: "Literal" },
  },
  arguments: [{ type: "Literal" }],
};

function getExpressions(stmt: ESTree.Statement): ESTree.Expression[] {
  if (stmt.type === "VariableDeclaration") {
    return stmt.declarations
      .map((d) => d.init)
      .filter((init): init is ESTree.Expression => Boolean(init));
  }
  if (
    stmt.type === "ExpressionStatement" &&
    stmt.expression.type === "AssignmentExpression"
  )
    return [stmt.expression.right];

  return [];
}

export function extractArray(
  statements: ESTree.Statement[],
): Array<number> | null {
  for (const statement of statements.slice(0, 30)) {
    for (const expr of getExpressions(statement)) {
      let pool: string[] | null = null;
      if (expr.type === "ArrayExpression" && expr.elements.length > 500) {
        pool = expr.elements.map((el) =>
          el && el.type === "Literal" && typeof el.value === "string"
            ? el.value
            : "",
        );
      } else if (matchesStructure(expr, split)) {
        const call = expr as ESTree.CallExpression;
        const str = (
          (call.callee as ESTree.MemberExpression).object as ESTree.Literal
        ).value;
        const delim = (call.arguments[0] as ESTree.Literal).value;
        if (typeof str === "string" && typeof delim === "string") {
          pool = str.split(delim);
        }
      }
      if (pool) {
        const actualSet = pool.indexOf("set");
        const actualAlr = pool.indexOf("alr");
        const actualYes = pool.indexOf("yes");
        if (actualSet !== -1 && actualAlr !== -1 && actualYes !== -1) {
          return [actualSet, actualSet ^ actualAlr, actualAlr ^ actualYes];
        }
      }
    }
  }
  return null;
}

export function extract(
  node: ESTree.Node,
  pool?: Array<number> | null,
  allStatements?: ESTree.Statement[],
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
    const fn = node.expression.right as ESTree.FunctionExpression;
    if (name && fn?.body?.body && !fn.async) {
      options.push({
        name: name,
        statements: fn.body.body,
      });
    }
  } else if (node.type === "VariableDeclaration") {
    for (const declaration of node.declarations) {
      const name = declaration.id;
      const fn = declaration.init as ESTree.FunctionExpression;
      if (name && fn?.body?.body && !fn.async) {
        options.push({
          name: name,
          statements: fn.body.body,
        });
      }
    }
  }

  for (const { name, statements } of options) {
    if (matchesStructure(statements, { anykey: [asdasd] })) {
      return createSolver(name);
    }
    if (pool) {
      const solver = matchPoolSolver(name, statements, pool, allStatements);
      if (solver) {
        return solver;
      }
    }
  }
  return null;
}

function isNode(val: unknown): val is ESTree.Node {
  return typeof val === "object" && val !== null && "type" in val;
}

function getPosition(
  node: ESTree.Node | null | undefined,
): { val: number; isXor: boolean } | null {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "number") {
    return { val: node.value, isXor: false };
  }
  if (node.type === "MemberExpression" && node.computed) {
    return getPosition(node.property);
  }
  if (node.type === "BinaryExpression" && node.operator === "^") {
    if (node.right.type === "Literal" && typeof node.right.value === "number") {
      return { val: node.right.value, isXor: true };
    }
    if (node.left.type === "Literal" && typeof node.left.value === "number") {
      return { val: node.left.value, isXor: true };
    }
  }
  return null;
}

function hasNewWithTrue(node: ESTree.Node): boolean {
  let has = false;
  function walk(n: ESTree.Node): void {
    if (has) return;
    if (
      n?.type === "NewExpression" &&
      n.arguments?.length >= 2 &&
      ((n.arguments[1]?.type === "Literal" && n.arguments[1].value === true) ||
        (n.arguments[1]?.type === "UnaryExpression" &&
          n.arguments[1].operator === "!" &&
          n.arguments[1].argument.type === "Literal" &&
          n.arguments[1].argument.value === 0))
    ) {
      has = true;
      return;
    }
    for (const child of Object.values(n)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (isNode(item)) {
            walk(item);
          }
        }
      } else if (isNode(child)) {
        walk(child);
      }
    }
  }
  walk(node);
  return has;
}

function findXorValue(
  node: ESTree.Node,
  pool: Array<number>,
): { key: number; isDirect: boolean } | null {
  let result: { key: number; isDirect: boolean } | null = null;
  function walk(n: ESTree.Node): void {
    if (result) return;
    if (
      n.type === "CallExpression" &&
      n.callee.type === "MemberExpression" &&
      n.arguments?.length >= 2
    ) {
      const k1 = getPosition(n.callee.property);
      const k2 = getPosition(n.arguments[0]);
      const k3 = getPosition(n.arguments[1]);
      if (
        k1 !== null &&
        k2 !== null &&
        k3 !== null &&
        (k1.val ^ k2.val) === pool[1] &&
        (k2.val ^ k3.val) === pool[2]
      ) {
        if (!k1.isXor && !k2.isXor && !k3.isXor) {
          result = { key: 0, isDirect: true };
          return;
        }
        result = { key: k1.val ^ pool[0], isDirect: false };
        return;
      }
    }
    for (const child of Object.values(n)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (isNode(item)) {
            walk(item);
          }
        }
      } else if (isNode(child)) {
        walk(child);
      }
    }
  }
  walk(node);
  return result;
}

function findArgs(
  allStatements: ESTree.Statement[],
  name: string,
  key: number,
): [number, number] | number[] | null {
  let found: [number, number] | number[] | null = null;
  function walk(node: ESTree.Node): void {
    if (found) return;
    if (
      node.type === "CallExpression" &&
      node.callee.type === "Identifier" &&
      node.callee.name === name &&
      node.arguments?.length
    ) {
      const a0 = node.arguments[0];
      const a1 = node.arguments[1];
      if (
        a0?.type === "Literal" &&
        typeof a0.value === "number" &&
        a1?.type === "Literal" &&
        typeof a1.value === "number"
      ) {
        if (
          (a0.value ^ a1.value) === key ||
          a0.value + a1.value === key ||
          a0.value - a1.value === key
        ) {
          found = [a0.value, a1.value];
          return;
        }
      }
      if (
        a0?.type === "Literal" &&
        typeof a0.value === "number" &&
        a0.value === key
      ) {
        found = [a0.value];
        return;
      }
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (isNode(item)) {
            walk(item);
          }
        }
      } else if (isNode(child)) {
        walk(child);
      }
    }
  }
  for (const s of allStatements) {
    walk(s);
    if (found) break;
  }
  return found;
}

function resolveOp(node: ESTree.Node, key: number): string | null {
  let init: ESTree.Expression | null | undefined = null;
  if (node.type === "VariableDeclaration") {
    for (const decl of node.declarations) {
      if (decl.init) {
        init = decl.init;
        break;
      }
    }
  } else if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "AssignmentExpression"
  ) {
    init = node.expression.right;
  }

  if (!init) return null;

  if (init.type === "MemberExpression") {
    return `${generate(init)} = ${key}`;
  }

  if (init.type === "BinaryExpression") {
    const isLeftMember = init.left.type === "MemberExpression";
    const slot = (
      isLeftMember ? init.left : init.right
    ) as ESTree.MemberExpression;
    const lit = (isLeftMember ? init.right : init.left) as ESTree.Literal;
    if (
      slot.type !== "MemberExpression" ||
      lit?.type !== "Literal" ||
      typeof lit.value !== "number"
    ) {
      return null;
    }
    const val = lit.value;
    switch (init.operator) {
      case "%":
        return `${generate(slot)} = ${val > key ? key : key + val}`;
      case "^":
        return `${generate(slot)} = ${key ^ val}`;
      case "+":
        return `${generate(slot)} = ${key - val}`;
      case "-":
        return `${generate(slot)} = ${isLeftMember ? key + val : val - key}`;
      case "&":
      case "|":
        return `${generate(slot)} = ${key}`;
    }
  }

  return null;
}

function matchPoolSolver(
  identifier: ESTree.Expression,
  bodyStatements: ESTree.Statement[],
  pool: Array<number>,
  allStatements?: ESTree.Statement[],
): ESTree.ArrowFunctionExpression | null {
  const node: ESTree.BlockStatement = {
    type: "BlockStatement",
    body: bodyStatements,
  };

  if (!hasNewWithTrue(node)) return null;

  const found = findXorValue(node, pool);
  if (!found) return null;

  if (found.isDirect) {
    return createSolver(identifier);
  }

  if (identifier.type === "Identifier" && allStatements) {
    const args = findArgs(allStatements, identifier.name, found.key);
    if (args) {
      return createSolver(identifier, args);
    }
  }

  for (const stmt of bodyStatements.slice(0, 5)) {
    const code = resolveOp(stmt, found.key);
    if (code) {
      return createSolver(identifier, undefined, code);
    }
  }

  return null;
}

function createSolver(
  expression: ESTree.Expression,
  args?: [number, number] | number[],
  code?: string,
): ESTree.ArrowFunctionExpression {
  const moreArgs = args && args.length ? `${args.join(", ")}, ` : "";
  const prefix = code ? `${code};\n  ` : "";
  return generateArrowFunction(`
({sig, n}) => {
  ${prefix}const url = (${generate(expression)})(${moreArgs}"https://youtube.com/watch?v=yt-dlp-wins", "s", sig ? encodeURIComponent(sig) : undefined);
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
