// more see http://rollupjs.org/guide/en/#configuration-files

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import styles from 'rollup-plugin-styles';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import del from 'rollup-plugin-delete';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

const isEnvDevelopment = String(process.env.NODE_ENV).trim() === 'development';
const isEnvProduction =
  String(process.env.NODE_ENV).trim() === 'production' || !isEnvDevelopment;
const babelConfig = require('./.babelrc.cjs');

const name = 'myLib';
const banner = () => {
  return `/*!
  * ${name}
  * @version ${pkg.version}
  * @date ${new Date().toLocaleString()}
  * @author ${pkg.author}
  */`;
};

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  cache: isEnvDevelopment,
  watch: {
    include: 'src/**',
  },
  onwarn: (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  },
  treeshake: isEnvProduction,
  input: 'src/index.ts',
  output: [
    // * UMD
    {
      file: 'build/bundle.umd.js',
      format: 'umd',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      // plugins: [
      //   isEnvProduction &&
      //     visualizer({ sourcemap: true, open: false, gzipSize: false }),
      // ],
    },
    isEnvProduction && {
      file: 'build/bundle.umd.min.js',
      format: 'umd',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      plugins: [terser()],
    },
    // * ES module
    isEnvProduction && {
      file: 'build/bundle.esm.js',
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [
        isEnvProduction &&
          visualizer({ sourcemap: true, open: true, gzipSize: false }),
      ],
    },
    isEnvProduction && {
      file: 'build/bundle.esm.min.js',
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
    // * CommonJS
    isEnvProduction && {
      file: 'build/bundle.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      // plugins: [
      //   isEnvProduction &&
      //     visualizer({ sourcemap: true, open: false, gzipSize: false }),
      // ],
    },
    isEnvProduction && {
      file: 'build/bundle.cjs.min.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
  ].filter(Boolean),
  plugins: [
    del({ targets: 'build/*', runOnce: true }),
    // isEnvDevelopment &&
    //   // no V8
    //   eslint({
    //     include: ['src/**/*.js', 'src/**/*.ts'],
    //     throwOnError: true,
    //     fix: true,
    //     formatter: 'pretty',
    //   }),
    commonjs({ sourceMap: isEnvDevelopment }),
    nodeResolve({ browser: true, extensions: ['.ts', '.js'] }),
    json(),
    url({
      limit: 1024 * 1000,
      fileName: '[name]-[hash][extname]',
    }),
    styles({
      autoModules: (id) => id.includes('.module.'),
      minimize: isEnvProduction,
      sourceMap: isEnvDevelopment,
      // sourceMap: [true, { content: false }]
    }),
    typescript({
      typescript: require('typescript'),
      tslib: require('tslib'),
    }),
    // polyfills
    isEnvProduction &&
      babel({
        ...babelConfig,
        babelrc: false,
        exclude: [/\/node_modules\//, /\/core-js\//],
        extensions: ['.ts', '.js'],
        babelHelpers: 'runtime',
      }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    isEnvProduction && strip({ include: ['src/**/*.js', 'src/**/*.ts'] }),
    isEnvProduction &&
      progress({
        clearLine: false, // default: true
      }),
    isEnvProduction && filesize(),
  ].filter(Boolean),
  external: [],
};

export default config;
