/* eslint-env node */
import { appframe } from "./package.json";

/* Rollup & plugins */
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import virtual from "rollup-plugin-virtual";
import replace from "rollup-plugin-replace";

function getConfig(isProd, format) {
  if (isProd) {
    process.env.NODE_ENV = "production";
  }

  const plugins = [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel()
  ];

  if (isProd) {
    plugins.push(minify({ comments: false }));
  }

  const entries = appframe instanceof Array ? appframe : [appframe];

  return entries.map(entry => {
    const fileExt = isProd ? `${format}.min.js` : `${format}.js`;
    const config = {
      input: `src/${entry.fileName}.js`,
      plugins,
      output: {
        externals: ["react", "react-dom"],
        file: `dist/${entry.fileName}.${fileExt}`,
        format: format === "esm.node" ? "esm" : format,
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        },
        name: entry.libraryName
      }
    };

    if (format !== "esm.node") {
      config.plugins.push(
        virtual({
          "react-dom": `const { ReactDOM } = window; export default ReactDOM;`,
          react: `const { React } = window;
export default React;
export const PureComponent = React.PureComponent;
export const Component = React.Component;
export const useState = React.useState;
export const useEffect = React.useEffect;`
        })
      );
    }

    return config;
  });
}

module.exports = commandLineArgs => {
  const isProd = commandLineArgs.configProd === true;

  return [...getConfig(isProd, "esm.node"), ...getConfig(isProd, "esm"), ...getConfig(isProd, "umd")];
};
