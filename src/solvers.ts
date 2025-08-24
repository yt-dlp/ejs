import { parse } from "npm:@babel/parser@7.28.3";
import { generate } from "npm:@babel/generator@7.28.3";
import { type ArrowFunctionExpression } from "npm:@babel/types@7.28.2";
import { getFunctionNodes } from "./utils.ts";
import { extract as extractSig } from "./sig.ts";
import { extract as extractNsig } from "./nsig.ts";

function setup() {
  // @ts-ignore: This is used in the babel generated js
  globalThis.XMLHttpRequest = { prototype: {} };
  // deno-lint-ignore no-unused-vars
  const window = Object.assign(Object.create(null), globalThis);
  // deno-lint-ignore no-unused-vars
  const document = {};
}

// helper functions
export function getSolvers(data: string): {
  nsig: ((val: string) => string) | null;
  sig: ((val: string) => string) | null;
} {
  const ast = parse(data, {
    attachComment: false,
  });
  const body = ast.program.body;
  if (body.length !== 2 || body[1].type !== "ExpressionStatement") {
    throw "unexpected structure";
  }
  const func = body[1];
  if (
    func.expression.type !== "CallExpression" ||
    func.expression.callee.type !== "FunctionExpression"
  ) {
    throw "unexpected structure";
  }
  const found = {
    nsig: [] as ArrowFunctionExpression[],
    sig: [] as ArrowFunctionExpression[],
  };
  const plainExpressions = func.expression.callee.body.body.filter(
    (node, idx) => {
      if (idx === 0) {
        // Ignore `var window = this;`
        return false;
      }
      if (node.type === "ExpressionStatement") {
        if (node.expression.type === "AssignmentExpression") {
          const nsig = extractNsig(node.expression);
          if (nsig) {
            found.nsig.push(nsig);
          }
          const sig = extractSig(node.expression);
          if (sig) {
            found.sig.push(sig);
          }
          return true;
        }
        return node.expression.type === "StringLiteral";
      }
      return true;
    },
  );
  func.expression.callee.body.body = plainExpressions;

  for (const [name, options] of Object.entries(found)) {
    if (options.length !== 1) {
      continue;
    }
    plainExpressions.push({
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
        },
        right: options[0],
      },
    });
  }

  ast.program.body.splice(0, 0, ...getFunctionNodes(setup));

  const { code } = generate(ast, {
    comments: false,
    compact: false,
    concise: false,
  });

  // evil eval!!?!
  const resultObj = { nsig: null, sig: null };
  Function("_result", code)(resultObj);
  return resultObj;
}
