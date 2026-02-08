import { type ESTree, parse } from "meriyah";
import { generate } from "astring";
import { extract as extractSig } from "./sig.ts";
import { extract as extractN } from "./n.ts";
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

  block.body = block.body.filter((node: ESTree.Statement) => {
    if (node.type === "ExpressionStatement") {
      if (node.expression.type === "AssignmentExpression") {
        return true;
      }
      return node.expression.type === "Literal";
    }
    return true;
  });

  return block.body;
}

export function getSolutions(
  statements: ESTree.Statement[],
): Record<string, ESTree.ArrowFunctionExpression[]> {
  const found = {
    n: [] as ESTree.ArrowFunctionExpression[],
    sig: [] as ESTree.ArrowFunctionExpression[],
  };
  for (const statement of statements) {
    const n = extractN(statement);
    if (n) {
      found.n.push(n);
    }
    const sig = extractSig(statement);
    if (sig) {
      found.sig.push(sig.expression);
    }
  }
  return found;
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
  return {
    type: "ArrowFunctionExpression",
    params: [
      {
        type: "Identifier",
        name: "_input",
      },
    ],
    body: {
      type: "BlockStatement",
      body: [
        {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name: "_results",
              },
              init: {
                type: "NewExpression",
                callee: {
                  type: "Identifier",
                  name: "Set",
                },
                arguments: [],
              },
            },
          ],
        },
        {
          type: "ForOfStatement",
          left: {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name: "_generator",
                },
                init: null,
              },
            ],
          },
          right: {
            type: "ArrayExpression",
            elements: generators,
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "TryStatement",
                block: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "CallExpression",
                        callee: {
                          type: "MemberExpression",
                          object: {
                            type: "Identifier",
                            name: "_results",
                          },
                          computed: false,
                          property: {
                            type: "Identifier",
                            name: "add",
                          },
                          optional: false,
                        },
                        arguments: [
                          {
                            type: "CallExpression",
                            callee: {
                              type: "Identifier",
                              name: "_generator",
                            },
                            arguments: [
                              {
                                type: "Identifier",
                                name: "_input",
                              },
                            ],
                            optional: false,
                          },
                        ],
                        optional: false,
                      },
                    },
                  ],
                },
                handler: {
                  type: "CatchClause",
                  param: null,
                  body: {
                    type: "BlockStatement",
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          await: false,
        },
        {
          type: "IfStatement",
          test: {
            type: "UnaryExpression",
            operator: "!",
            argument: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "_results",
              },
              computed: false,
              property: {
                type: "Identifier",
                name: "size",
              },
              optional: false,
            },
            prefix: true,
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ThrowStatement",
                argument: {
                  type: "TemplateLiteral",
                  expressions: [],
                  quasis: [
                    {
                      type: "TemplateElement",
                      value: {
                        cooked: "no solutions",
                        raw: "no solutions",
                      },
                      tail: true,
                    },
                  ],
                },
              },
            ],
          },
          alternate: null,
        },
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            left: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "_results",
              },
              computed: false,
              property: {
                type: "Identifier",
                name: "size",
              },
              optional: false,
            },
            right: {
              type: "Literal",
              value: 1,
            },
            operator: "!==",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ThrowStatement",
                argument: {
                  type: "TemplateLiteral",
                  expressions: [
                    {
                      type: "CallExpression",
                      callee: {
                        type: "MemberExpression",
                        object: {
                          type: "Identifier",
                          name: "_results",
                        },
                        computed: false,
                        property: {
                          type: "Identifier",
                          name: "join",
                        },
                        optional: false,
                      },
                      arguments: [
                        {
                          type: "Literal",
                          value: ", ",
                        },
                      ],
                      optional: false,
                    },
                  ],
                  quasis: [
                    {
                      type: "TemplateElement",
                      value: {
                        cooked: "invalid solutions: ",
                        raw: "invalid solutions: ",
                      },
                      tail: false,
                    },
                    {
                      type: "TemplateElement",
                      value: {
                        cooked: "",
                        raw: "",
                      },
                      tail: true,
                    },
                  ],
                },
              },
            ],
          },
          alternate: null,
        },
        {
          type: "ReturnStatement",
          argument: {
            type: "MemberExpression",
            object: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "CallExpression",
                  callee: {
                    type: "MemberExpression",
                    object: {
                      type: "Identifier",
                      name: "_results",
                    },
                    computed: false,
                    property: {
                      type: "Identifier",
                      name: "values",
                    },
                    optional: false,
                  },
                  arguments: [],
                  optional: false,
                },
                computed: false,
                property: {
                  type: "Identifier",
                  name: "next",
                },
                optional: false,
              },
              arguments: [],
              optional: false,
            },
            computed: false,
            property: {
              type: "Identifier",
              name: "value",
            },
            optional: false,
          },
        },
      ],
    },
    async: false,
    expression: false,
    generator: false,
  };
}
