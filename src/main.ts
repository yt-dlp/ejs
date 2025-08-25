import { writeAll } from "@std/io";
import { preprocessPlayer, getFromPrepared } from "./solvers.ts";
import { isOneOf } from "./utils.ts";

async function main(): Promise<Output> {
  if (Deno.stdin.isTerminal()) {
    throw "Expected input on stdin";
  }
  const input: Input = await new Response(Deno.stdin.readable).json();
  const preprocessedPlayer =
    input.type === "player"
      ? preprocessPlayer(input.player)
      : input.preprocessed_player;
  const solvers = getFromPrepared(preprocessedPlayer);

  const responses = input.requests.map(
    (request): JsChallengeProviderResponse => {
      if (!isOneOf(request.type, "nsig", "sig")) {
        return {
          type: "error",
          request,
          error: `Failed to extract ${request.type} function`,
        };
      }
      const solver = solvers[request.type];
      if (!solver) {
        return {
          type: "error",
          request,
          error: `Failed to extract ${request.type} function`,
        };
      }
      try {
        return {
          type: "result",
          request,
          response: solver(request.challenge),
        };
      } catch (error) {
        return {
          type: "error",
          request,
          error: `${error}`,
        };
      }
    }
  );

  const output: Output = {
    type: "result",
    responses,
  };
  if (input.type === "player" && input.output_preprocessed) {
    output.preprocessed_player = preprocessedPlayer;
  }
  return output;
}

async function safeMain(): Promise<Output> {
  try {
    return await main();
  } catch (error) {
    return {
      type: "error",
      error: `${error}`,
    };
  }
}

const output = await safeMain();
const bytes = new TextEncoder().encode(JSON.stringify(output));
await writeAll(Deno.stdout, bytes);

type Input =
  | {
      type: "player";
      player: string;
      requests: JsChallengeRequest[];
      output_preprocessed: boolean;
    }
  | {
      type: "preprocessed";
      preprocessed_player: string;
      requests: JsChallengeRequest[];
    };

type JsChallengeRequest = {
  type: string;
  challenge: string;
  player_url: string;
  video_id: string | null;
};

type JsChallengeProviderResponse =
  | {
      type: "result";
      request: JsChallengeRequest;
      response: string;
    }
  | {
      type: "error";
      request: JsChallengeRequest;
      error: string;
    };

type Output =
  | {
      type: "result";
      preprocessed_player?: string;
      responses: JsChallengeProviderResponse[];
    }
  | {
      type: "error";
      error: string;
    };
