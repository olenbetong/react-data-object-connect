/* eslint-env node */
const dotenv = require("dotenv");
const fs = require("fs");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2));

dotenv.load();

const { APPFRAME_LOGIN: user, APPFRAME_PWD: password } = process.env;

const targets = [];
const unminified = new RegExp("([a-z-]+).(umd|esm).js$", "gi");
const minified = new RegExp("([a-z-]+).(umd|esm).min.js$", "gi");

fs.readdirSync("./dist").forEach(file => {
  const exp = args.mode === "test" ? unminified : minified;

  if (exp.test(file)) {
    const result = /([a-z-]+)\.(umd|esm)/gi.exec(file);
    const name = result[1];
    const format = result[2];

    targets.push({
      source: `./dist/${file}`,
      target: `modules/${format}/${name}.min.js`,
      type: "component-global"
    });
  }
});

module.exports = {
  hostname: "synergi.olenbetong.no",
  user,
  password,
  targets
};
