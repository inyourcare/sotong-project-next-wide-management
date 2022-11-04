import log from "loglevel";
import chalk from "chalk";
import prefix from "loglevel-plugin-prefix";

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

if (process.env.NODE_ENV == "development") {
  log.setLevel("debug");
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    const levelString = level.toUpperCase() as "TRACE"|"DEBUG"|"INFO"|"WARN"|"ERROR";
    return `${chalk.gray(`[${timestamp}]`)} ${colors[
      levelString
    ](level)} ${chalk.green(`${name}:`)}`;
  },
});

export { log as logger };
