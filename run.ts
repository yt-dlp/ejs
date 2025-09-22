import { exit } from "node:process";
import { readFileSync } from "node:fs";

import { isOneOf } from "./src/utils.ts";
import main from "./src/main.ts";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    `ERROR: Missing argument\nusage: ${
      process.argv[1]
    } <player> [<type>:<request> ...]`,
  );
  exit(1);
}

const player = readFileSync(args[0], "utf-8");
const requests = {
  nsig: [] as string[],
  sig: [] as string[],
};
for (const request of args.slice(1)) {
  const [type, challenge] = request.split(":", 2);
  if (!isOneOf(type, "sig", "nsig")) {
    console.error(`ERROR: Unsupported request type: ${type}`);
    exit(1);
  }
  requests[type].push(challenge);
}
console.log(JSON.stringify(main({
  type: "player",
  player,
  output_preprocessed: false,
  requests: [
    { type: "nsig", challenges: requests.nsig },
    { type: "sig", challenges: requests.sig },
  ],
})));
