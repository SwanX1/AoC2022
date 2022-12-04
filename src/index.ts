try {
  require("logerian");
} catch (err) {
  console.error("Automatically installing dependencies. This is a one-time setup stage.");
  try {
    execCommand("yarn --no-lockfile");
  } catch {
    console.error("Yarn is not installed or failed to run, falling back to npm.");
    try {
      execCommand("npm i --no-package-lock --no-shrinkwrap");
    } catch (err) {
      console.error("NPM is not installed or failed to run.");
      process.exit(1);
    }
  }
}

if (process.exitCode !== 1) {
  const { Logger } = require("logerian");
  const chalk = require("chalk");
  const path = require("path");
  const fs = require("fs");

  const logger = new Logger();

  if (!fs.existsSync(path.join(__dirname, "./solutions"))) {
    logger.error("You haven't built the project yet!");
    logger.info("Building project automatically...");
    try {
      execCommand("yarn build");
    } catch (err) {
      logger.error("Couldn't build project!");
      logger.error(err);
      process.exit(1);
    }
  }

  const { measurePerf } = require("./util");

  const argv = process.argv.slice(2);

  const day = Number(argv[0]);
  const scripts = [];

  if (Number.isNaN(day)) {
    logger.info("No day specified, running all solutions!");
    scripts.push(
      ...fs.readdirSync(path.join(__dirname, "./solutions"))
        .filter((file: string) => file.endsWith(".js"))
        .map((file: string) => path.join(__dirname, "./solutions", file))
    );
  } else {
    scripts.push(path.join(__dirname, `./solutions/day${day}.js`));
  }

  const scriptTime = measurePerf();
  for (const script of scripts) {
    try {
      const time = measurePerf();
      execCommand(`node ${path.relative(path.join(__dirname, ".."), script)}`);
      logger.debug(chalk`Running script took ${time()}`);
    } catch (err) {
      logger.error(err);
    }
  }
  if (scripts.length > 1) {
    logger.debug(chalk`Running all scripts took ${scriptTime()}`);
  }
  process.exit(0);
}

function execCommand(command: string) {
  const child_process = require("child_process");
  const path = require("path");

  let log;
  try {
    const logger = (new (require("logerian").Logger)());
    log = logger.debug.bind(logger);
  } catch (err) {
    log = console.log;
  }

  log(`$ ${command}`);
  child_process.execSync(command, { cwd: path.join(__dirname, ".."), stdio: "inherit" });
}
