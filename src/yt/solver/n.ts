import { type ESTree } from "meriyah";
import { matchesStructure } from "../../utils.ts";
import { type DeepPartial } from "../../types.ts";

const identifier = {
  type: "VariableDeclaration",
  kind: "var",
  declarations: {
    anykey: [
      {
        type: "VariableDeclarator",
        id: {
          type: "Identifier",
        },
        init: {
          type: "ArrayExpression",
          elements: [
            {
              type: "Identifier",
            },
          ],
        },
      },
    ],
  },
} as const;

const catchBlockBody = [
  {
    type: "ReturnStatement",
    argument: {
      type: "BinaryExpression",
      left: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
        },
        computed: true,
        property: {
          type: "Literal",
        },
        optional: false,
      },
      right: {
        type: "Identifier",
      },
      operator: "+",
    },
  },
] as const;

export function extract(
  node: ESTree.Node,
): ESTree.ArrowFunctionExpression | null {
  if (!matchesStructure(node, identifier as unknown as DeepPartial<ESTree.Node>)) {
    // Fallback search for try { } catch { return X[12] + Y }
    let name: string | undefined | null = null;
    let block: ESTree.BlockStatement | null | undefined = null;
    switch (node.type) {
      case "ExpressionStatement": {
        if (
          node.expression.type === "AssignmentExpression" &&
          node.expression.left.type === "Identifier" &&
          node.expression.right.type === "FunctionExpression" &&
          node.expression.right.params.length === 1
        ) {
          name = node.expression.left.name;
          block = node.expression.right.body;
        }
        break;
      }
      case "FunctionDeclaration": {
        if (node.params.length === 1) {
          name = node.id?.name;
          block = node.body;
        }
        break;
      }
    }
    if (!block || !name) {
      return null;
    }
    const tryNode = block.body.at(-2);
    if (
      tryNode?.type !== "TryStatement" ||
      tryNode.handler?.type !== "CatchClause"
    ) {
      return null;
    }
    const catchBody = tryNode.handler!.body.body;
    if (matchesStructure(catchBody, catchBlockBody)) {
      return makeSolverFuncFromName(name);
    }
    return null;
  }

  if (node.type !== "VariableDeclaration") {
    return null;
  }
  for (const declaration of node.declarations) {
    if (
      declaration.type !== "VariableDeclarator" ||
      !declaration.init ||
      declaration.init.type !== "ArrayExpression" ||
      declaration.init.elements.length !== 1
    ) {
      continue;
    }
    const [firstElement] = declaration.init.elements;
    if (!firstElement || firstElement.type !== "Identifier") {
      continue;
    }
    return makeSolverFuncFromName(firstElement.name);
  }
  return null;
}

function makeSolverFuncFromName(name: string): ESTree.ArrowFunctionExpression {
  return {
    type: "ArrowFunctionExpression",
    params: [
      {
        type: "Identifier",
        name: "n",
      },
    ],
    body: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: name,
      },
      arguments: [
        {
          type: "Identifier",
          name: "n",
        },
      ],
      optional: false,
    },
    async: false,
    expression: false,
    generator: false,
  };
}
