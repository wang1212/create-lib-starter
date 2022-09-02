// more see http://rollupjs.org/guide/en/#configuration-files

import virtual from '@rollup/plugin-virtual';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import styles from 'rollup-plugin-styles';
import { babel } from '@rollup/plugin-babel';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
// node
import process from 'process';
import path from 'path';
import { URL, fileURLToPath } from 'url';
import fse from 'fs-extra';

// ! 项目目录
const WORKING_DIRECTORY = fileURLToPath(new URL('.', import.meta.url));
console.log('current working directory: ' + WORKING_DIRECTORY);

// ! 脚本必须在项目根目录执行，防止脚本执行错误
if (!fse.pathExistsSync(path.join(WORKING_DIRECTORY, 'package.json'))) {
  throw new Error(
    'The package.json file does not exist in the current working directory.\n'
  );
}

// ! 清空构建目录
fse.emptyDirSync(path.join(WORKING_DIRECTORY, 'build/'));

const NUMBER_KB = 1024;
const NUMBER_1000 = 1000;

const babelConfig = require('./.babelrc.cjs');

const isEnvDevelopment = String(process.env.NODE_ENV).trim() === 'development';
const isEnvProduction =
  String(process.env.NODE_ENV).trim() === 'production' || !isEnvDevelopment;

const pkg = fse.readJSONSync('./package.json', { encoding: 'utf8' });

// 暴露的全局变量名称
const name = 'myLib';
const banner = () => {
  // see docs: https://github.com/terser/terser#keeping-copyright-notices-or-other-comments
  return `/*!
  * ${pkg.name}
  * @description ${pkg.description}
  * @version ${pkg.version}
  * @date ${new Date().toLocaleString()}
  * @author ${pkg.author}
  */`;
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configBuilder = ({ keepDebug = false, env = 'development' } = {}) => ({
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
    isEnvProduction && {
      file: 'build/bundle.umd.js',
      format: 'umd',
      name,
      banner,
      sourcemap: true,
    },
    // * ES module
    {
      file: 'build/bundle.esm.js',
      format: 'es',
      banner,
      sourcemap: true,
      // plugins: [
      //   isEnvProduction &&
      //     visualizer({ sourcemap: true, open: true, gzipSize: true, brotliSize: false })
      // ].filter(Boolean)
    },
    // * CommonJS
    isEnvProduction && {
      file: 'build/bundle.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true,
    },
  ].filter(Boolean),
  plugins: [
    // ! 将调试包的代码剥离
    !keepDebug &&
      virtual({
        ajv: 'export default {}',
        'src/helper/validate': 'export default {}',
      }),
    commonjs({ sourceMap: isEnvDevelopment }),
    nodeResolve({ browser: true, extensions: ['.ts', '.js'] }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(
          keepDebug ? env : process.env.NODE_ENV
        ),
      },
    }),
    json(),
    url({
      limit: NUMBER_KB * NUMBER_1000,
      fileName: '[name]-[hash][extname]',
    }),
    styles({
      autoModules: (id) => id.includes('.module.'),
      minimize: isEnvProduction,
      sourceMap: isEnvDevelopment,
      // sourceMap: [true, { content: false }]
    }),
    isEnvDevelopment &&
      esbuild({
        target: 'esnext',
      }),
    // 编译，兼容性处理，注入 polyfills
    isEnvProduction &&
      babel({
        ...babelConfig,
        babelrc: false,
        exclude: [/* /\/node_modules\//, */ /\/core-js\//],
        extensions: ['.ts', '.js'],
        babelHelpers: 'runtime',
      }),
    !keepDebug &&
      isEnvProduction &&
      strip({ include: ['src/**/*.js', 'src/**/*.ts'] }),
    isEnvProduction &&
      progress({
        clearLine: false, // default: true
      }),
    isEnvProduction && filesize(),
  ].filter(Boolean),
  external: [],
});

/**
 * 生产包
 * @type {import('rollup').RollupOptions}
 */
const productionConfig = {
  ...configBuilder(),
  output: [
    // * UMD
    isEnvProduction && {
      file: 'build/bundle.umd.min.js',
      format: 'umd',
      name,
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
    // * ES module
    isEnvProduction && {
      file: 'build/bundle.esm.min.js',
      format: 'es',
      banner,
      sourcemap: true,
      plugins: [
        terser(),
        isEnvProduction &&
          visualizer({
            sourcemap: true,
            open: true,
            gzipSize: true,
            brotliSize: false,
          }),
      ].filter(Boolean),
    },
    // * CommonJS
    isEnvProduction && {
      file: 'build/bundle.cjs.min.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      plugins: [terser()],
    },
  ].filter(Boolean),
};

const exportConfig = [configBuilder({ keepDebug: true })];
if (isEnvProduction) {
  exportConfig.push(productionConfig);
}

// 生成类型定义入口文件
function generateTypesEntryFile(config) {
  config.output.forEach((item) => {
    const bundleFile = path.join(WORKING_DIRECTORY, item.file);
    fse.writeFileSync(
      bundleFile.replace(path.extname(bundleFile), '.d.ts'),
      'export * from "../types"',
      { encoding: 'utf-8' }
    );
  });
}
exportConfig.forEach((config) => generateTypesEntryFile(config));

export default exportConfig;
