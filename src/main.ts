import { getFromPrepared, preprocessPlayer } from "./solvers.ts";
import { isOneOf } from "./utils.ts";

export default function main(input: Input): Output {
  const preprocessedPlayer = input.type === "player"
    ? preprocessPlayer(input.player)
    : input.preprocessed_player;
  const solvers = getFromPrepared(preprocessedPlayer);

  const responses = input.requests.map(
    (input): Response => {
      if (!isOneOf(input.type, "n", "sig")) {
        return {
          type: "error",
          error: `Unknown request type: ${input.type}`,
        };
      }
      const solver = solvers[input.type];
      if (!solver) {
        return {
          type: "error",
          error: `Failed to extract ${input.type} function`,
        };
      }
      try {
        return {
          type: "result",
          data: Object.fromEntries(
            input.challenges.map((challenge) => [challenge, solver(challenge)]),
          ),
        };
      } catch (error) {
        return {
          type: "error",
          error: error instanceof Error
            ? `${error.message}\n${error.stack}`
            : `${error}`,
        };
      }
    },
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

export type Input =
  | {
    type: "player";
    player: string;
    requests: Request[];
    output_preprocessed: boolean;
  }
  | {
    type: "preprocessed";
    preprocessed_player: string;
    requests: Request[];
  };

type Request = {
  type: "n" | "sig";
  challenges: string[];
};

type Response =
  | {
    type: "result";
    data: Record<string, string>;
  }
  | {
    type: "error";
    error: string;
  };

export type Output =
  | {
    type: "result";
    preprocessed_player?: string;
    responses: Response[];
  }
  | {
    type: "error";
    error: string;
  };
