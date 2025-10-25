import { type ESTree, parse } from "meriyah";
import { generate } from "astring";
import { extract as extractSig } from "./sig.ts";
import { extract as extractN } from "./n.ts";
import { setupNodes } from "./setup.ts";
import VM from "node:vm";

function getBlock(astBody: ESTree.Statement[]) {
  switch (astBody.length) {
    case 1: {
      const func = astBody[0];
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
      const func = astBody[1];
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
}

export function preprocessPlayer(data: string): string {
  const ast = parse(data);
  const body = ast.body;

  const block = getBlock(body);

  const found = {
    n: [] as ESTree.ArrowFunctionExpression[],
    sig: [] as ESTree.ArrowFunctionExpression[],
  };
  const plainExpressions = block.body.filter((node: ESTree.Node) => {
    const n = extractN(node);
    if (n) {
      found.n.push(n);
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

  return generate(ast);
}

export function getFromPrepared(code: string): {
  n: ((val: string) => string) | null;
  sig: ((val: string) => string) | null;
} {
  const resultObj = { n: null, sig: null };
  Function("_result", code)(resultObj);
  return resultObj;
}

export type Challenge = { type: "n" | "sig"; challenge: string };

export function solveAll(preparedCode: string, challenges: Challenge[]) {
  // Readonly & Deepcopy challenges
  const freezeChallenges = Object.create(null) as Record<number, Challenge> & {
    length: number;
  };
  for (let i = 0; i < challenges.length; i++) {
    freezeChallenges[i] = Object.freeze<Challenge>({ ...challenges[i] });
  }
  freezeChallenges.length = challenges.length;
  Object.freeze(freezeChallenges);

  let sandbox = {
    // XMLHttpRequest: Object.create(null),
    _$values: freezeChallenges,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    _$makeSolver: null as Function | null,
  };
  let context = VM.createContext(sandbox);

  let compiledFunction = VM.compileFunction(preparedCode, ["_result"], {
    parsingContext: context,
    filename: "yt-player-virtual.min.js",
  });
  // let compiledFunction = () => (null)
  sandbox._$makeSolver = compiledFunction;

  try {
    const resultStr: string = VM.runInContext(
      `
      let _$isolver = Object.create(null);
      _$isolver.n = null;
      _$isolver.sig = null;
      _$makeSolver(_$isolver);
      Object.freeze(_$isolver);

      const _$result = Array.prototype.map.call(_$values, (value) => {
        const resolved = _$isolver[value.type]?.(value.challenge);
        if (resolved == null) {
          return null;
        }
        return String(resolved);
      });
      
      // GC management
      _$isolver = null;
      _$values = null;
      _$makeSolver = null;
      XMLHttpRequest = null;
      document = null;
      navigator = null;
      Date = null;

      JSON.stringify(_$result);
    `,
      context,
    );

    const result = JSON.parse(resultStr) as Array<string | null>;
    return {
      success: !result.find((v) => v == null),
      result,
    } as
      | { success: true; result: string[] }
      | { success: false; result: Array<string | null> };
  } finally {
    // @ts-expect-error Better GC management
    sandbox = null;
    // @ts-expect-error Better GC management
    context = null;
    // @ts-expect-error Better GC management
    compiledFunction = null;
  }
}
