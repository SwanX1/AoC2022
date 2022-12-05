import chalk from "chalk";
import { getLogger, getResource, measurePerf } from "../util";

const logger = getLogger(__filename);

const copyObject = <T>(arr: T) => JSON.parse(JSON.stringify(arr)) as T;

void async function main() {
  let time: (() => string) | string;
  time = measurePerf();
  const input = await getResource("day5.txt");
  time = time();
  logger.debug(`Reading file took ${time}`);

  time = measurePerf();
  const stacks: string[][] = [];
  const parseStacksEndIndex = input.indexOf("\n\n");
  const stacksLines = input.substring(0, parseStacksEndIndex).trim().split("\n");
  const instructionLines = input.substring(parseStacksEndIndex, input.length).trim().split("\n");
  for (let i = 0; i < stacksLines.length; i++) {
    const line = stacksLines[i];
    for (let j = 0; j < line.length; j++) {
      const stack = ~~(j / 4);
      const id = line[j];
      const isStackNumber = !Number.isNaN(parseInt(id, 10));
      if (isStackNumber) {
        continue;
      }
      if (j % 4 !== 1) {
        continue;
      }

      stacks[stack] ??= [];
      if (id !== " ") {
        stacks[stack][i] = id;
      }
    }
  }

  for (let i = 0; i < stacks.length; i++) {
    stacks[i] = stacks[i].reverse().filter(box => box);
    logger.debug(stacks[i]);
  }

  const instructions: [number, number, number][] = [];
  for (let i = 0; i < instructionLines.length; i++) {
    const line = instructionLines[i];
    const instruction = line.replace(/(move )|(from )|(to )/g, "").split(" ").map(n => Number(n)) as [number, number, number];
    instruction[1]--;
    instruction[2]--;
    instructions.push(instruction);
  }
  
  logger.debug(chalk`Parsing took {yellow ${time()}}`);
  
  time = measurePerf();
  const stacks_part1 = copyObject(stacks);
  const stacks_part2 = copyObject(stacks);
  for (const instruction of instructions) {
    const [amount, from, to] = instruction;

    const fromBoxes_part1: string[] = [];
    for (let i = 0; i < amount; i++) {
      fromBoxes_part1.push(stacks_part1[from].pop() as string);
    }
    stacks_part1[to].push(...fromBoxes_part1);


    let fromBoxes_part2: string[] = [];
    for (let i = 0; i < amount; i++) {
      fromBoxes_part2.push(stacks_part2[from].pop() as string);
    }
    fromBoxes_part2 = fromBoxes_part2.reverse();
    stacks_part2[to].push(...fromBoxes_part2);
  }

  let solution_part1 = "";
  for (let i = 0; i < stacks_part1.length; i++) {
    solution_part1 += stacks_part1[i][stacks_part1[i].length - 1];
  }

  let solution_part2 = "";
  for (let i = 0; i < stacks_part2.length; i++) {
    solution_part2 += stacks_part2[i][stacks_part2[i].length - 1];
  }

  logger.debug(chalk`Simulation took {yellow ${time()}}`);
  logger.info(chalk`Part 1 solution was {yellow ${solution_part1}}`);
  logger.info(chalk`Part 2 solution was {yellow ${solution_part2}}`);
}();
