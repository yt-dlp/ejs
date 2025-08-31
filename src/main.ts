import { read, write } from "./io.ts";

import { getFromPrepared, preprocessPlayer } from "./solvers.ts";
import { isOneOf } from "./utils.ts";

function main(input: Input): Output {
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
          error: `Unknown request type: ${request.type}`,
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
          error:
            error instanceof Error
              ? `${error.message}\n${error.stack}`
              : `${error}`,
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

async function safeMain(): Promise<void> {
  try {
    const input = await read();
    const output = main(input);
    await write(output);
  } catch (error) {
    await write({
      type: "error",
      error: `${error}`,
    });
  }
}

safeMain();

export type Input =
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

export type Output =
  | {
      type: "result";
      preprocessed_player?: string;
      responses: JsChallengeProviderResponse[];
    }
  | {
      type: "error";
      error: string;
    };
