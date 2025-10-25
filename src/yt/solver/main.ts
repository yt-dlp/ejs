import { preprocessPlayer, solveAll, type Challenge } from "./solvers.ts";
import { isOneOf } from "../../utils.ts";

export default function main(input: Input): Output {
  const preprocessedPlayer =
    input.type === "player"
      ? preprocessPlayer(input.player)
      : input.preprocessed_player;

  const solveChallenges = input.requests.flatMap((req) => {
    return req.challenges.map<Challenge>((challenge) => ({
      type: req.type,
      challenge,
    }));
  });

  try {
    const solved = solveAll(preprocessedPlayer, solveChallenges);

    let offset = 0;
    const responses = input.requests.map<Response>((req) => {
      if (!isOneOf(req.type, "n", "sig")) {
        offset += 1;
        return {
          type: "error",
          error: `Unknown request type: ${req.type}`,
        };
      }

      const solvedPair = req.challenges.map(
        (challenge) => [challenge, solved.result[offset++]] as const,
      );

      if (solvedPair.find((v) => v[1] == null)) {
        // for compatibility of output
        return {
          type: "error",
          error: `Failed to extract ${input.type} function`,
        };
      }

      return {
        type: "result",
        data: Object.fromEntries(solvedPair as Array<[string, string]>),
      };
    });

    const output: Output = {
      type: "result",
      responses,
    };
    if (input.type === "player" && input.output_preprocessed) {
      output.preprocessed_player = preprocessedPlayer;
    }
    return output;
  } catch (error) {
    return {
      type: "error",
      error:
        error instanceof Error
          ? `${error.message}\n${error.stack}`
          : `${error}`,
    } satisfies Output;
  }
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
