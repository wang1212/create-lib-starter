// more see http://rollupjs.org/guide/en/#configuration-files

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import strip from '@rollup/plugin-strip';
import eslint from '@rollup/plugin-eslint';
import del from 'rollup-plugin-delete';

const isDevelopment = process.env.NODE_ENV === 'development';

const name = 'myLib';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    // * IIFE
    {
      file: 'build/bundle.js',
      format: 'iife',
      name,
      // globals: { cesium: 'Cesium' },
      sourcemap: true,
    },
    !isDevelopment && {
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
    !isDevelopment && {
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
    !isDevelopment && {
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
    !isDevelopment && {
      file: 'build/bundle.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
  ].filter(Boolean),
  plugins: [
    del({ targets: 'build/*' }),
    isDevelopment &&
      eslint({
        include: ['src/**/*.js', 'src/**/*.ts'],
        throwOnError: true,
        fix: true,
        formatter: 'pretty',
      }),
    nodeResolve(),
    commonjs(),
    !isDevelopment && strip(),
    typescript({ useTsconfigDeclarationDir: true }),
    progress({
      clearLine: false, // default: true
    }),
    !isDevelopment && filesize(),
    visualizer({ sourcemap: true, open: false, gzipSize: false }),
  ].filter(Boolean),
  external: [],
};

export default config;
