/* eslint-env node */
import { appframe } from "./package.json";

import babel from "rollup-plugin-babel";
import virtual from "rollup-plugin-virtual";
import resolve from "rollup-plugin-node-resolve";
import fileSize from "rollup-plugin-filesize";
import externals from "rollup-plugin-node-externals";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import alias from "@rollup/plugin-alias";
import path from "path";

const extensions = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".json"];

const developmentBrowsers = [
  "last 5 Chrome versions",
  "last 5 Firefox versions",
  "last 3 Safari versions",
  "last 2 Edge versions",
];

const developmentTargets = {
  browsers: developmentBrowsers,
};

const productionTargets = {
  browsers: [...developmentBrowsers, "IE 11"],
};

function getBabelConfig(targets) {
  const config = {
    babelrc: false,
    runtimeHelpers: true,
    exclude: "node_modules/**",
    extensions,
    presets: [
      ["@babel/preset-env", { targets, useBuiltIns: false }],
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      ["@babel/plugin-transform-runtime", { regenerator: true, useESModules: true }],
    ],
  };

  return config;
}

const preactPath = path.resolve("./node_modules/preact/compat/src/index.js");

function getConfig({ isProd, format, targets = productionTargets, preact = false }) {
  const babelConfig = getBabelConfig(targets);

  const plugins = [];

  if (preact) {
    plugins.push(
      alias({
        entries: [{ find: "react", replacement: preactPath }],
      }),
    );
  }

  plugins.push(
    externals({
      include: [
        "@olenbetong/common",
        "xdate",
        "react",
        "react-dom",
        "preact",
        "preact/hooks",
        "preact/compat",
        preactPath,
      ],
    }),
  );
  plugins.push(babel(babelConfig));
  plugins.push(commonjs());
  plugins.push(
    resolve({
      extensions,
    }),
  );
  plugins.push(
    replace({
      "process.env.NODE_ENV": `"${isProd ? "production" : "development"}"`,
    }),
  );
  plugins.push(fileSize({ showBrotli: true }));

  if (isProd) {
    process.env.NODE_ENV = "production";
    plugins.push(terser());
  }

  const entries = appframe instanceof Array ? appframe : [appframe];

  return entries
    .filter(entry => entry.fileName === "hooks" || preact === false)
    .map(entry => {
      const fileExt = isProd ? "min.js" : "js";
      const conf = {
        input: `src/${entry.fileName}.js`,
        plugins,
        output: {
          file: `dist/${format}/${entry.libraryName}${preact ? ".preact" : ""}.${fileExt}`,
          format,
          name: entry.libraryName,
          globals: {
            [preactPath]: "preactCompat",
            "preact/hooks": "preactHooks",
            preact: "preact",
            react: "React",
            "react-dom": "ReactDOM",
            "@olenbetong/common": "af.common",
            xdate: "XDate",
          },
        },
      };

      if (format === "esm") {
        conf.plugins.push(
          virtual({
            preact: `export default window.preact`,
            "react/hooks": `
            const { preactHooks } = window;
            export {
              useCallback: preactHoos.useCallback,
              useEffect: preactHoos.useEffect,
              useState: preactHoos.useState,
              useRef: preactHoos.useRef,
            }
          `,
            xdate: `const { XDate } = window; export default XDate;`,
            "react-dom": `const { ReactDOM } = window; export default ReactDOM;`,
            react: `const { React } = window;
  export default React;
  export const PureComponent = React.PureComponent;
  export const Component = React.Component;
  export const useCallback = React.useCallback;
  export const useEffect = React.useEffect;
  export const useState = React.useState;
  export const useRef = React.useRef;`,
          }),
        );
      }

      return conf;
    });
}

module.exports = commandLineArgs => {
  const isProd = commandLineArgs.configProd === true;

  return [
    ...getConfig({ isProd, format: "esm", targets: developmentTargets }),
    ...getConfig({ isProd, format: "umd", targets: productionTargets }),
    ...getConfig({ isProd, format: "iife", targets: productionTargets }),
    ...getConfig({ isProd, format: "iife", targets: productionTargets, preact: true }),
    ...getConfig({ isProd, format: "cjs", targets: { node: "9" } }),
  ];
};
