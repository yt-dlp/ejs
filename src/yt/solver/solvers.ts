import { generate } from "astring";
import { type ESTree, parse } from "meriyah";

import { generateArrowFunction } from "../../utils.ts";
import { extract } from "./nsig.ts";
import { setupNodes } from "./setup.ts";

export function preprocessPlayer(data: string): string {
  const program = parse(data);
  const plainStatements = modifyPlayer(program);
  const solutions = getSolutions(plainStatements);
  for (const [name, options] of Object.entries(solutions)) {
    plainStatements.push({
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "=",
        left: {
          type: "MemberExpression",
          computed: false,
          object: {
            type: "Identifier",
            name: "_result",
          },
          property: {
            type: "Identifier",
            name: name,
          },
          optional: false,
        },
        right: multiTry(options),
      },
    });
  }

  program.body.splice(0, 0, ...setupNodes);
  return generate(program);
}

export function modifyPlayer(program: ESTree.Program) {
  const body = program.body;

  const block: ESTree.BlockStatement = (() => {
    switch (body.length) {
      case 1: {
        const func = body[0];
        if (
          func?.type === "ExpressionStatement" &&
          func.expression.type === "CallExpression" &&
          func.expression.callee.type === "MemberExpression" &&
          func.expression.callee.object.type === "FunctionExpression"
        ) {
          return func.expression.callee.object.body;
        }
        break;
      }
      case 2: {
        const func = body[1];
        if (
          func?.type === "ExpressionStatement" &&
          func.expression.type === "CallExpression" &&
          func.expression.callee.type === "FunctionExpression"
        ) {
          const block = func.expression.callee.body;
          // Skip `var window = this;`
          block.body.splice(0, 1);
          return block;
        }
        break;
      }
    }
    throw "unexpected structure";
  })();

  const inherits = findInheritsHelper(block.body);
  block.body = block.body.filter((node: ESTree.Statement) => {
    if (node.type === "ExpressionStatement") {
      if (node.expression.type === "AssignmentExpression") {
        return true;
      }
      if (
        inherits !== null &&
        node.expression.type === "CallExpression" &&
        generate(node.expression.callee) === inherits
      ) {
        // Keep `inherits(Sub, Base)`: a kept top-level `new Sub` may need it
        return true;
      }
      return node.expression.type === "Literal";
    }
    return true;
  });

  return block.body;
}

/**
 * Finds the player's class inheritance helper, e.g. `g.z=function(a,b){
 * a.prototype=Object.create(b.prototype);a.prototype.constructor=a;...}`,
 * and returns its generated name.
 */
function findInheritsHelper(statements: ESTree.Statement[]): string | null {
  for (const node of statements) {
    if (
      node.type !== "ExpressionStatement" ||
      node.expression.type !== "AssignmentExpression" ||
      node.expression.operator !== "=" ||
      node.expression.right.type !== "FunctionExpression" ||
      node.expression.right.params.length !== 2
    ) {
      continue;
    }
    const found = node.expression.right.body.body.some(
      (stmt) =>
        stmt.type === "ExpressionStatement" &&
        stmt.expression.type === "AssignmentExpression" &&
        stmt.expression.left.type === "MemberExpression" &&
        !stmt.expression.left.computed &&
        stmt.expression.left.property.type === "Identifier" &&
        stmt.expression.left.property.name === "constructor" &&
        stmt.expression.left.object.type === "MemberExpression" &&
        !stmt.expression.left.object.computed &&
        stmt.expression.left.object.property.type === "Identifier" &&
        stmt.expression.left.object.property.name === "prototype",
    );
    if (found) {
      return generate(node.expression.left);
    }
  }
  return null;
}

export function getSolutions(
  statements: ESTree.Statement[],
): Record<string, ESTree.ArrowFunctionExpression[]> {
  const found = {
    n: [] as ESTree.ArrowFunctionExpression[],
    sig: [] as ESTree.ArrowFunctionExpression[],
  };
  for (const statement of statements) {
    const result = extract(statement);
    if (result) {
      found.n.push(
        makeSolver(result, {
          type: "Identifier",
          name: "n",
        }),
      );
      found.sig.push(
        makeSolver(result, {
          type: "Identifier",
          name: "sig",
        }),
      );
    }
  }
  return found;
}

function makeSolver(
  result: ESTree.ArrowFunctionExpression,
  ident: ESTree.Identifier,
): ESTree.ArrowFunctionExpression {
  return {
    type: "ArrowFunctionExpression",
    params: [ident],
    body: {
      type: "MemberExpression",
      object: {
        type: "CallExpression",
        callee: result,
        arguments: [
          {
            type: "ObjectExpression",
            properties: [
              {
                type: "Property",
                key: ident,
                value: ident,
                kind: "init",
                computed: false,
                method: false,
                shorthand: true,
              },
            ],
          },
        ],
        optional: false,
      },
      computed: false,
      property: ident,
      optional: false,
    },
    async: false,
    expression: true,
    generator: false,
  };
}

export function getFromPrepared(code: string): {
  n: ((val: string) => string) | null;
  sig: ((val: string) => string) | null;
} {
  const resultObj = { n: null, sig: null };
  Function("_result", code)(resultObj);
  return resultObj;
}

function multiTry(
  generators: ESTree.ArrowFunctionExpression[],
): ESTree.ArrowFunctionExpression {
  return generateArrowFunction(`
(_input) => {
  const _results = new Set();
  const errors = [];
  for (const _generator of ${generate({
    type: "ArrayExpression",
    elements: generators,
  } as ESTree.Node)}) {
    try {
      _results.add(_generator(_input));
    } catch (e) {
      errors.push(e);
    }
  }
  if (!_results.size) {
    throw \`no solutions: \${errors.join(", ")}\`;
  }
  if (_results.size !== 1) {
    throw \`invalid solutions: \${[..._results].map(x => JSON.stringify(x)).join(", ")}\`;
  }
  return _results.values().next().value;
}
`);
}
