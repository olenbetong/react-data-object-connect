/* eslint-env node */
const dotenv = require("dotenv");
const fs = require("fs");
const minimist = require("minimist");
const args = minimist(process.argv.slice(2));
const pkg = require("./package.json");
const [version] = pkg.version.split("-");
const [major] = version.split(".");

dotenv.config();

const { APPFRAME_LOGIN: user, APPFRAME_PWD: password } = process.env;

const targets = [];
const unminified = new RegExp("^([a-z]+).js$", "gi");
const minified = new RegExp("^([a-z]+).min.js$", "gi");

async function getTargets() {
  const folders = ["esm", "iife"];
  for (let folder of folders) {
    if (fs.existsSync(`./dist/${folder}`)) {
      const files = await fs.promises.readdir(`./dist/${folder}`);

      for (let file of files) {
        const exp = args.mode === "test" ? unminified : minified;
        if (exp.test(file)) {
          const result = /([a-z-]+)/gi.exec(file);
          const name = result[1];

          targets.push({
            source: `./dist/${folder}/${file}`,
            target: `modules/react-data-object-connect/${major}/${folder}/${name}.min.js`,
            type: "component-global"
          });
        }
      }
    }
  }
}

getTargets();

module.exports = {
  hostname: "synergi.olenbetong.no",
  user,
  password,
  targets
};
