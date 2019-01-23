/* eslint-env node */
import { appframe } from "./package.json";

/* Rollup & plugins */
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import virtual from "rollup-plugin-virtual";
import replace from "rollup-plugin-replace";

function getConfig(formats) {
  return commandLineArgs => {
    const isProd = commandLineArgs.configProd === true;

    if (isProd) {
      process.env.NODE_ENV = "production";
    }

    const plugins = [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      virtual({
        "react-dom": `
					const { ReactDOM } = window; export default ReactDOM;
				`,
        react: `
					const { React } = window;
					export default React;
					export const PureComponent = React.PureComponent;
					export const Component = React.Component;
				`
      }),
      babel()
    ];

    if (isProd) {
      plugins.push(minify({ comments: false }));
    }

    let entries = appframe instanceof Array ? appframe : [appframe];

    return entries.map(entry => ({
      input: `src/${entry.fileName}.js`,
      plugins,
      output: formats.map(format => {
        const fileExt = isProd ? `${format}.min.js` : `${format}.js`;

        return {
          externals: ["react", "react-dom"],
          file: `dist/${entry.fileName}.${fileExt}`,
          format,
          globals: {
            react: "React",
            "react-dom": "ReactDOM"
          },
          name: entry.libraryName
        };
      })
    }));
  };
}

module.exports = getConfig(["esm", "umd"]);
