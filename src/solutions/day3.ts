import chalk from "chalk";
import { getLogger, getResource, measurePerf } from "../util";

const logger = getLogger(__filename);

const PRIORITY_MAP: Record<string, number> = {};
for (let i = 0; i < 26; i++) {
  PRIORITY_MAP[(i + 10).toString(36)] = i + 1;
  PRIORITY_MAP[(i + 10).toString(36).toUpperCase()] = i + 27;
}

void async function main() {
  let time: (() => string) | string;
  time = measurePerf();
  const input = await getResource("day3.txt");
  time = time();
  logger.debug(`Reading file took ${time}`);

  time = measurePerf();
  const rucksacks: string[] = input.split("\n")
    .filter(line => line.trim());
  logger.debug(`Parsing took ${time()}`);

  const compartments: [string, string][] = rucksacks
    .map(line => [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2, line.length)
    ]);

  time = measurePerf();
  const duplicateItems: string[] = compartments
    .map(([comp1, comp2]) => {
      for (const item of comp1) {
        if (comp2.includes(item)) {
          return item;
        }
      }
      return null;
    })
    .filter((duplicate, index) => {
      if (duplicate !== null) {
        return true;
      }

      logger.warn(
        chalk`Rucksack {yellow ${index + 1}} {gray [${compartments[index][0]},}` +
        chalk`{gray ${compartments[index][0]}]} contains no duplicate items!`
      );
      return false;
    }) as string[];

  const priorities_part1: number[] = duplicateItems
    .map(duplicateItem => PRIORITY_MAP[duplicateItem])
    .filter((priority, index) => {
      if (typeof priority !== "undefined") {
        return true;
      }

      logger.warn(chalk`No priority for item {yellow ${duplicateItems[index]}}!`);
      return false;
    });

  const prioritySum_part1 = priorities_part1.reduce((a, b) => a + b, 0);

  const duplicateItemsInGroups: string[] = [];
  for (let i = 0; i < rucksacks.length / 3; i++) {
    let commonItem: string | undefined;
    for (const item of rucksacks[i * 3]) {
      if (
        rucksacks[(i * 3) + 1].includes(item) &&
        rucksacks[(i * 3) + 2].includes(item)
      ) {
        commonItem = item;
        break;
      }
    }
    if (typeof commonItem !== "string") {
      logger.warn(chalk`Group {yellow ${i}} doesn't have a common item!`)
      logger.warn(chalk`Item bags:\n\t{gray${rucksacks[i * 3 + 0]}}\n\t{gray${rucksacks[i * 3 + 1]}}\n\t{gray${rucksacks[i * 3 + 2]}}`);
      continue;
    }

    duplicateItemsInGroups.push(commonItem);
  }

  const priorities_part2: number[] = duplicateItemsInGroups
    .map(duplicateItem => PRIORITY_MAP[duplicateItem])
    .filter((priority, index) => {
      if (typeof priority !== "undefined") {
        return true;
      }

      logger.warn(chalk`No priority for item {yellow ${duplicateItemsInGroups[index]}}!`);
      return false;
    });

  const prioritySum_part2 = priorities_part2.reduce((a, b) => a + b, 0);

  logger.debug(`Performing calculations took ${time()}`);
  logger.info(chalk`Part 1 solution was {yellow ${prioritySum_part1}}`);
  logger.info(chalk`Part 2 solution was {yellow ${prioritySum_part2}}`);
}();