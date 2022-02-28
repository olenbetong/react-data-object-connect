/* eslint-env node */
import esbuild from "esbuild";
import { gzipSizeFromFile } from "gzip-size";
import fs from "fs-extra";
import chalk from "chalk";
import filesize from "filesize";
import stripAnsi from "strip-ansi";
import { readFile } from "node:fs/promises";

async function importJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url)));
}

const pkg = await importJson("../package.json");

function getEntryConfig({ format, isProd }) {
  const entries = Array.isArray(pkg.appframe) ? pkg.appframe : [pkg.appframe];

  return entries.map((entry) => {
    const fileExt = isProd ? "min.js" : "js";
    const conf = {
      entryPoints: [`./src/${entry.fileName}.js`],
      outfile: `./dist/${format}/${entry.libraryName}.${fileExt}`,
      format,
      minify: isProd,
      // external: ["react", "react-dom"],
    };

    if (format === "iife") {
      conf.globalName = entry.libraryName;
    }

    return conf;
  });
}

function getConfig() {
  let bundles = [
    ...getEntryConfig({ format: "esm", isProd: true }),
    ...getEntryConfig({ format: "esm", isProd: false }),
    ...getEntryConfig({ format: "iife", isProd: true }),
    ...getEntryConfig({ format: "iife", isProd: false }),
    {
      entryPoints: ["./src/index.js"],
      outfile: "./dist/cjs/index.js",
      format: "cjs",
      minify: false,
    },
  ];
  let result = [];

  bundles.forEach((entry) => {
    let options = {
      minify: false,
      bundle: true,
      target: "es2017",
      format: "esm",
      define: {
        "process.env.NODE_ENV": '"production"',
        __DEV__: 0,
        __VERSION__: `"${pkg.version}"`,
      },
      sourcemap: entry.minify ?? false,
      ...entry,
    };

    result.push(options);
  });

  return result;
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
  var FIFTY_KILOBYTES = 1024 * 50;
  var difference = currentSize - previousSize;
  var fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red("+" + fileSize);
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow("+" + fileSize);
  } else if (difference < 0) {
    return chalk.green(fileSize);
  } else {
    return "";
  }
}

async function build() {
  let entries = getConfig();
  let sizes = {};
  for (let entry of entries) {
    sizes[entry.outfile] = fs.existsSync(entry.outfile)
      ? await gzipSizeFromFile(entry.outfile)
      : 0;
  }

  fs.emptyDirSync("./dist");

  await Promise.all(entries.map((entry) => esbuild.build(entry)));

  let maxLabelWidth = 0;
  for (let entry of entries) {
    entry.sizeBefore = sizes[entry.outfile];
    entry.sizeAfter = await gzipSizeFromFile(entry.outfile);
    let difference = entry.sizeBefore
      ? getDifferenceLabel(entry.sizeAfter, entry.sizeBefore)
      : 0;
    entry.sizeLabel =
      filesize(entry.sizeAfter) + (difference ? ` (${difference})` : "");
    maxLabelWidth = Math.max(maxLabelWidth, stripAnsi(entry.sizeLabel).length);
  }

  entries = entries.sort((a, b) => b.sizeAfter - a.sizeAfter);

  for (let entry of entries) {
    console.log(
      `  ${entry.sizeLabel.padEnd(maxLabelWidth, " ")}  ${chalk.dim(
        entry.outfile
      )}`
    );
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
