import chalk from "chalk";
import { getLogger, getResource, measurePerf } from "../util";

const logger = getLogger(__filename);

type Shape = "ROCK" | "PAPER" | "SCISSORS";
type RoundOutcome = "WIN" | "LOSS" | "DRAW";

const SHAPE_MAP: Record<string, Shape> = {
  "A": "ROCK",
  "B": "PAPER",
  "C": "SCISSORS",
  "X": "ROCK",
  "Y": "PAPER",
  "Z": "SCISSORS",
};

const OUTCOME_MAP: Record<string, RoundOutcome> = {
  "X": "LOSS",
  "Y": "DRAW",
  "Z": "WIN",
};

const SHAPE_POINT_TABLE: Record<Shape, number> = {
  "ROCK": 1,
  "PAPER": 2,
  "SCISSORS": 3,
};

const OUTCOME_POINT_TABLE: Record<RoundOutcome, number> = {
  "LOSS": 0,
  "DRAW": 3,
  "WIN": 6,
};

const WINNING_SHAPES: Record<Shape, Shape> = {
  "ROCK": "PAPER",
  "PAPER": "SCISSORS",
  "SCISSORS": "ROCK",
};

const LOSING_SHAPES: Record<Shape, Shape> = {
  "PAPER": "ROCK",
  "SCISSORS": "PAPER",
  "ROCK": "SCISSORS",
};

void async function main() {
  let time: (() => string) | string;
  time = measurePerf();
  const input = await getResource("day2.txt");
  time = time();
  logger.debug(`Reading file took ${time}`);

  time = measurePerf();
  const strategy: [Shape, [Shape, RoundOutcome]][] = input.split("\n")
    .filter(line => line.trim())
    .map(elf => elf.split(" ", 2))
    .map(([a, b]) => [SHAPE_MAP[a], [SHAPE_MAP[b], OUTCOME_MAP[b]]]) as unknown as [Shape, [Shape, RoundOutcome]][];
  logger.debug(`Parsing took ${time()}`);

  time = measurePerf();
  const roundPoints_part1 = strategy.map(([req, res]) => {
    let outcomePoints;
    if (req === res[0]) {
      outcomePoints = OUTCOME_POINT_TABLE["DRAW"];
    } else if (WINNING_SHAPES[req] === res[0]) {
      outcomePoints = OUTCOME_POINT_TABLE["WIN"];
    } else {
      outcomePoints = OUTCOME_POINT_TABLE["LOSS"];
    }
    const shapePoints = SHAPE_POINT_TABLE[res[0]];
    return outcomePoints + shapePoints;
  });

  const pointSum_part1 = roundPoints_part1.reduce((prev, curr) => prev + curr, 0);

  const roundPoints_part2 = strategy.map(([req, res]) => {
    let outcome = res[1];
    const outcomePoints = OUTCOME_POINT_TABLE[outcome];
    let resShape;
    switch (outcome) {
      case "DRAW":
        resShape = req;
        break;
      case "WIN":
        resShape = WINNING_SHAPES[req];
        break;
      case "LOSS":
        resShape = LOSING_SHAPES[req];
        break;
    }
    const shapePoints = SHAPE_POINT_TABLE[resShape];
    return outcomePoints + shapePoints;
  });

  const pointSum_part2 = roundPoints_part2.reduce((prev, curr) => prev + curr, 0);

  logger.debug(`Performing calculations took ${time()}`);

  logger.info(chalk`Part 1 solution was {yellow ${pointSum_part1}} points`);
  logger.info(chalk`Part 2 solution was {yellow ${pointSum_part2}} points`);
}();
