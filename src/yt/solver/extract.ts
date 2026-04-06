import { parse } from "meriyah";
import { getIO } from "./test/io.ts";
import { downloadCached } from "./test/utils.ts";
import { argv } from "node:process";
import { getSolutions, modifyPlayer } from "./solvers.ts";
import { generate } from "astring";

const data = await (
  argv.length > 3
    ? () => downloadCached(argv[2], argv[3])
    : async () => {
        const io = await getIO();
        return await io.read(argv[2]);
      }
)();

const program = parse(data);
const statements = modifyPlayer(program);
const solutionMap = getSolutions(statements);
for (const solutions of Object.values(solutionMap)) {
  for (const solution of solutions) {
    console.log(String.raw`${generate(solution)}`);
  }
}
