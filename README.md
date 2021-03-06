# create lib starter

This is a startup development configuration template used to build the **JavaScript/Node.js** library.

The build tool is based on [rollup](http://rollupjs.org/) and [babel](https://babeljs.io/), among other tools.

[English](./README.md) | [简体中文](./README.zh-CN.md)

## Bundle

Run `npm run build`, the following bundles will eventually be generated.

    build/
    ├── bundle.js
    ├── bundle.min.js
    ├── bundle.esm.js
    ├── bundle.esm.min.js
    ├── bundle.cjs.js
    ├── bundle.cjs.min.js
    ├── bundle.umd.js
    └── bundle.umd.min.js

Will also generate the corresponding **sourcemap** file.

## Usage

There are two ways to use this template:

-   1. Open [GitHub Repository Website](https://github.com/wang1212/create-lib-starter), then Click **Use this template** Button.

-   2. Another way, clone to local

```bash
git clone https://github.com/wang1212/create-lib-starter.git
npm install
```

Modify `package.json` information, such as `name`, `description`, etc.

Then, modify the remote address of the github repository to your own:

```bash
git remote set-url origin 'your own address'
```

## Others

Due to the different build tools, a variety of options are provided:

-   [babel](https://github.com/wang1212/create-lib-starter/) - build based on babel.js.
-   [typescript](https://github.com/wang1212/create-lib-starter/tree/typescript) - build based on typescript. (branch)

## License

[MIT](./LICENSE).
