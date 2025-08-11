#!/usr/bin/env node
import { uniqueUsernameGenerator, adjectives, nouns, Config, generateMany } from "./index";
import { writeFileSync } from "fs";

function parseArgs(argv: string[]): Partial<Config & { count?: number; unique?: boolean; out?: string; unsafe?: boolean }> {
  const args = argv.slice(2);
  const config: Partial<Config & { count?: number; unique?: boolean; out?: string; unsafe?: boolean }> = {};
  const dictionaries: string[][] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--separator" || a === "-s") {
      config.separator = args[++i] ?? "";
    } else if (a === "--digits" || a === "-d") {
      const n = Number(args[++i] ?? 0);
      if (!Number.isNaN(n)) config.randomDigits = n;
    } else if (a === "--length" || a === "-l") {
      const n = Number(args[++i] ?? 0);
      if (!Number.isNaN(n) && n > 0) config.length = n;
    } else if (a === "--style") {
      config.style = args[++i] as any;
    } else if (a === "--upper" || a === "-U") {
      config.style = "upperCase" as any;
    } else if (a === "--dict" || a === "-D") {
      // comma-separated list
      const list = (args[++i] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
      if (list.length > 0) dictionaries.push(list);
    } else if (a === "--exclude" || a === "-x") {
      const list = (args[++i] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
      config.exclude = list;
    } else if (a === "--seed") {
      config.seed = args[++i];
    } else if (a === "--template" || a === "-t") {
      config.template = args[++i] ?? "";
    } else if (a === "--count" || a === "-c") {
      const n = Number(args[++i] ?? 1);
      if (!Number.isNaN(n) && n > 0) (config as Partial<Config> & { count?: number }).count = n;
    } else if (a === "--unique" || a === "-u") {
      (config as Partial<Config> & { unique?: boolean }).unique = true;
    } else if (a === "--out" || a === "-o") {
      (config as Partial<Config> & { out?: string }).out = args[++i] ?? "";
    } else if (a === "--unsafe") {
      (config as Partial<Config> & { unsafe?: boolean }).unsafe = true;
    } else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  config.dictionaries = dictionaries.length > 0 ? dictionaries : [adjectives, nouns];
  return config;
}

function printHelp() {
  const text = `unique-username-generator

Usage: usergen [options]

Options:
  -s, --separator <sep>     Separator between words (default: empty)
  -d, --digits <n>          Number of random digits to append (0-6)
  -l, --length <n>          Maximum username length (default: 15)
      --style <style>       Style: lowerCase | upperCase | capital | camelCase | pascalCase | kebabCase | snakeCase
  -U, --upper               Shortcut for --style upperCase
  -D, --dict <a,b,c>        Provide a custom dictionary (can be used multiple times)
  -x, --exclude <a,b,c>     Extra words to exclude
      --seed <seed>         Deterministic seed for reproducible output
  -t, --template <tpl>      Template, e.g. "{adjective}-{noun}-{digits:2}"
  -c, --count <n>           Generate many
  -u, --unique              Ensure unique usernames within this run
  -o, --out <file>          Write results to a file (UTF-8)
      --unsafe              Disable profanity filtering
  -h, --help                Show help
`;
  // eslint-disable-next-line no-console
  console.log(text);
}

function main() {
  const parsed = parseArgs(process.argv) as Partial<Config> & { count?: number; unique?: boolean; out?: string; unsafe?: boolean };
  const { count, unique, out, unsafe, ...cfg } = parsed;
  if (unsafe) {
    cfg.profanityList = [];
    cfg.exclude = [];
  }
  const list = count && count > 1
    ? generateMany({ ...(cfg as Config), count, unique: !!unique })
    : [uniqueUsernameGenerator(cfg as Config)];
  if (out) {
    writeFileSync(out, list.join("\n"), "utf8");
  } else {
    // eslint-disable-next-line no-console
    list.forEach((u) => console.log(u));
  }
}

main();


