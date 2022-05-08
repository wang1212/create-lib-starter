// more see http://rollupjs.org/guide/en/#configuration-files

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import typescript from 'rollup-plugin-typescript2';
import esbuild, { minify } from 'rollup-plugin-esbuild';
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
  input: 'src/index.ts',
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
      plugins: [minify()],
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
      plugins: [minify()],
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
      plugins: [minify()],
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
      plugins: [minify()],
    },
  ].filter(Boolean),
  plugins: [
    del({ targets: 'build/*' }),
    isDevelopment &&
      // no V8
      eslint({
        include: ['src/**/*.js', 'src/**/*.ts'],
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
    !isDevelopment &&
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        check: false,
      }),
    isDevelopment &&
      esbuild({
        target: 'esnext',
        // optimizeDeps: {
        //   include: Object.keys(pkg.dependencies),
        // },
      }),
    !isDevelopment && strip({ include: ['src/**/*.js', 'src/**/*.ts'] }),
    !isDevelopment &&
      progress({
        clearLine: false, // default: true
      }),
    !isDevelopment && filesize(),
  ].filter(Boolean),
  external: [],
};

export default config;
