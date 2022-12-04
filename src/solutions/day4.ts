import chalk from "chalk";
import { getLogger, getResource, measurePerf } from "../util";

const logger = getLogger(__filename);

type Range = [number, number];

function rangeLength(range: Range): number {
  return range[1] - range[0];
}

function rangeOverlap(range1: Range, range2: Range): number[] {
  const [range1Min, range1Max] = range1;
  const [range2Min, range2Max] = range2;

  const minOverlap = Math.max(range1Min, range2Min);
  const maxOverlap = Math.min(range1Max, range2Max);

  const overlap: number[] = [];

  if (range1Min > range2Max || range2Min > range1Max) {
    return overlap;
  }

  for (let i = minOverlap; i <= maxOverlap; i++) {
    overlap.push(i);
  }

  return overlap;
}

void async function main() {
  let time: (() => string) | string;
  time = measurePerf();
  const input = await getResource("day4.txt");
  time = time();
  logger.debug(`Reading file took ${time}`);

  time = measurePerf();
  const lines = input.split("\n").filter(line => line.trim());
  let fullOverlaps = 0;
  let noOverlaps = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const pair = line
      .split(",", 2)
      .map(range =>
        range.split("-")
          .map(n => Number(n))
      ) as [Range, Range];
    let overlap = rangeOverlap(...pair);

    if (
      overlap.length > rangeLength(pair[0]) ||
      overlap.length > rangeLength(pair[1])
    ) {
      fullOverlaps++;
    }

    if (overlap.length === 0) {
      noOverlaps++;
    }
  }
  logger.debug(chalk`Parsing and calculations took ${time()}`);
  logger.info(chalk`Part 1 solution is {yellow ${fullOverlaps}} pairs`);
  logger.info(chalk`Part 2 solution is {yellow ${lines.length - noOverlaps}} pairs`);
}();
