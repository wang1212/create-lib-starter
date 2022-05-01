// more see http://rollupjs.org/guide/en/#configuration-files

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';

const name = 'myLib';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: [
    // * IIFE
    {
      file: 'build/bundle.js',
      format: 'iife',
      name,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
    },
    {
      file: 'build/bundle.min.js',
      format: 'iife',
      name,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      plugins: [terser()],
    },
    // * UMD
    {
      file: 'build/bundle.umd.js',
      format: 'umd',
      name,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
    },
    {
      file: 'build/bundle.umd.min.js',
      format: 'umd',
      name,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
      plugins: [terser()],
    },
    // * ES module
    {
      file: 'build/bundle.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'build/bundle.esm.min.js',
      format: 'es',
      sourcemap: true,
      plugins: [terser()],
    },
    // * CommonJS
    {
      file: 'build/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'build/bundle.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    progress({
      clearLine: false, // default: true
    }),
    visualizer({ sourcemap: true, open: false, gzipSize: false }),
    filesize(),
  ],
  external: [],
};

export default config;
