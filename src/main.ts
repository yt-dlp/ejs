import { getSolvers } from "./solvers.ts";
import { isOneOf } from "./utils.ts";

if (Deno.stdin.isTerminal()) {
  console.error("Expected player content on stdin");
  Deno.exit(9);
}
const stdin = await new Response(Deno.stdin.readable).text();
if (!stdin) {
  console.error("Expected player content on stdin");
  Deno.exit(9);
}
if (Deno.args.length < 1) {
  console.error("Expected one argument, `solver nsig:... nsig:... sig:...`");
  Deno.exit(9);
}

const solveList: {
  mode: "nsig" | "sig";
  value: string;
}[] = [];
for (const arg of Deno.args) {
  const split = arg.split(":", 2);
  if (split.length === 1) {
    console.error(`Missing mode: ${arg}`);
    Deno.exit(1);
  }
  const [mode, value] = split;
  if (!isOneOf(mode, "sig", "nsig")) {
    console.error(`Invalid mode, expected "nsig:..." or "sig:...": ${mode}`);
    Deno.exit(1);
  }
  solveList.push({ mode, value });
}

const solvers = getSolvers(stdin);
for (const solve of solveList) {
  const solver = solvers[solve.mode];
  if (!solver) {
    console.error(`Did not set ${solve.mode} function`);
    Deno.exit(1);
  }
  console.log(solver(solve.value));
}
