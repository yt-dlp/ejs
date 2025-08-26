import { type ESTree, parse } from "meriyah";
import { generate } from "astring";
import { extract as extractSig } from "./sig.ts";
import { extract as extractNsig } from "./nsig.ts";
import { setupNodes } from "./setup.ts";

export function preprocessPlayer(data: string): string {
  const ast = parse(data);
  const body = ast.body;

  const block = (() => {
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

  const found = {
    nsig: [] as ESTree.ArrowFunctionExpression[],
    sig: [] as ESTree.ArrowFunctionExpression[],
  };
  const plainExpressions = block.body.filter((node: ESTree.Node) => {
    const nsig = extractNsig(node);
    if (nsig) {
      found.nsig.push(nsig);
    }
    const sig = extractSig(node);
    if (sig) {
      found.sig.push(sig);
    }
    if (node.type === "ExpressionStatement") {
      if (node.expression.type === "AssignmentExpression") {
        return true;
      }
      return node.expression.type === "Literal";
    }
    return true;
  });
  block.body = plainExpressions;

  for (const [name, options] of Object.entries(found)) {
    // TODO: this is cringe fix plz
    const unique = new Set(options.map((x) => JSON.stringify(x)));
    if (unique.size !== 1) {
      const message = `found ${unique.size} ${name} function possibilities`;
      throw (
        message +
        (unique.size ? `: ${options.map((x) => generate(x)).join(", ")}` : "")
      );
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

  ast.body.splice(0, 0, ...setupNodes);

  const code = generate(ast);
  return code;
}

export function getFromPrepared(code: string): {
  nsig: ((val: string) => string) | null;
  sig: ((val: string) => string) | null;
} {
  const resultObj = { nsig: null, sig: null };
  Function("_result", code)(resultObj);
  return resultObj;
}
