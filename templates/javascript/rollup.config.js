// more see http://rollupjs.org/guide/en/#configuration-files

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import strip from '@rollup/plugin-strip';
import eslint from '@rollup/plugin-eslint';
import del from 'rollup-plugin-delete';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

const isDevelopment = process.env.NODE_ENV === 'development';

const name = 'myLib' || pkg.name;
const banner = () => {
  return `/**
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
  cache: !!isDevelopment,
  watch: {
    include: 'src/**',
  },
  treeshake: !isDevelopment,
  input: 'src/index.js',
  output: [
    // * IIFE
    !isDevelopment && {
      file: 'build/bundle.js',
      format: 'iife',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      // plugins: [
      //   !isDevelopment &&
      //     visualizer({ sourcemap: true, open: false, gzipSize: false }),
      // ],
    },
    !isDevelopment && {
      file: 'build/bundle.min.js',
      format: 'iife',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      plugins: [terser()],
    },
    // * UMD
    {
      file: 'build/bundle.umd.js',
      format: 'umd',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      // plugins: [
      //   !isDevelopment &&
      //     visualizer({ sourcemap: true, open: false, gzipSize: false }),
      // ],
    },
    !isDevelopment && {
      file: 'build/bundle.umd.min.js',
      format: 'umd',
      name,
      banner,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      plugins: [terser()],
    },
    // * ES module
    !isDevelopment && {
      file: 'build/bundle.esm.js',
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [
        !isDevelopment &&
          visualizer({ sourcemap: true, open: true, gzipSize: false }),
      ],
    },
    !isDevelopment && {
      file: 'build/bundle.esm.min.js',
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
    // * CommonJS
    !isDevelopment && {
      file: 'build/bundle.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      // plugins: [
      //   !isDevelopment &&
      //     visualizer({ sourcemap: true, open: false, gzipSize: false }),
      // ],
    },
    !isDevelopment && {
      file: 'build/bundle.cjs.min.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
  ].filter(Boolean),
  plugins: [
    del({ targets: 'build/*' }),
    isDevelopment &&
      // no V8
      eslint({
        include: 'src/**/*.js',
        throwOnError: true,
        fix: true,
        formatter: 'pretty',
      }),
    nodeResolve({ browser: true }),
    commonjs({ sourceMap: !isDevelopment }),
    json(),
    url({
      filename: '[name]-[hash][extname]',
    }),
    babel({ babelHelpers: 'bundled' }),
    !isDevelopment && strip(),
    !isDevelopment &&
      progress({
        clearLine: false, // default: true
      }),
    !isDevelopment && filesize(),
  ].filter(Boolean),
  external: [],
};

export default config;
