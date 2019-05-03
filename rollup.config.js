/* eslint-env node */
import { appframe } from "./package.json";

/* Rollup & plugins */
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import virtual from "rollup-plugin-virtual";
import replace from "rollup-plugin-replace";

function getBabelConfig(format) {
  const config = {
    babelrc: false,
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: [
              "last 5 Chrome versions",
              "last 5 Firefox versions",
              "last 3 Safari versions",
              "last 2 Edge versions"
            ]
          },
          useBuiltIns: false
        }
      ],
      "@babel/preset-react"
    ],
    plugins: ["@babel/plugin-proposal-class-properties"],
    ignore: ["node_modules"]
  };

  if (format === "umd") {
    config.presets[0][1].targets.browsers.push("IE 11");
  }

  return config;
}

function getConfig(isProd, format) {
  if (isProd) {
    process.env.NODE_ENV = "production";
  }

  const plugins = [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel(getBabelConfig(format))
  ];

  if (isProd) {
    plugins.push(terser());
  }

  const entries = appframe instanceof Array ? appframe : [appframe];

  return entries.map(entry => {
    const fileExt = isProd ? `min.js` : `js`;
    const config = {
      input: `src/${entry.fileName}.js`,
      plugins,
      output: {
        externals: ["react", "react-dom"],
        file: `dist/${format}/${entry.fileName}.${fileExt}`,
        format: format,
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        },
        name: entry.libraryName
      }
    };

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

    return config;
  });
}

module.exports = commandLineArgs => {
  const isProd = commandLineArgs.configProd === true;

  return [
    ...getConfig(isProd, "esm"),
    ...getConfig(isProd, "umd"),
    ...getConfig(isProd, "iife")
  ];
};
