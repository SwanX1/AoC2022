import chalk from "chalk";
import { getLogger, getResource, measurePerf } from "../util";

const logger = getLogger(__filename);

void async function main() {
  let time: (() => string) | string;
  time = measurePerf();
  const input = await getResource("day1.txt");
  time = time();
  logger.debug(`Reading file took ${time}`);

  time = measurePerf();
  const elves: number[][] = input.split("\n\n").map(elf => elf.split("\n").map(line => Number(line)));
  logger.debug(`Parsing took ${time()}`);

  time = measurePerf();
  const elfSum = elves.map(elf => elf.reduce((prev, curr) => prev + curr, 0)).sort((a, b) => b - a);
  logger.debug(`Performing calculations took ${time()}`);

  logger.info(chalk`Part 1 solution was {yellow ${elfSum[0]}} calories`);
  logger.info(chalk`Part 2 solution was {yellow ${elfSum[0] + elfSum[1] + elfSum[2]}} calories`);
}();
