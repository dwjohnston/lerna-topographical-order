# 

This repo reproduces a gotcha with lerna lerna topology and the the `lerna run` command. 

## Project structure

This is a standard lerna monorepo with three packages. 

**@example/a** - A leaf dependency that needs to be compiled with typescript

**@example/b** - Depends on `@example/a`, and does not need to be compiled. 

**@example/c** - The top level application. Depends on `@example/b` - and is compiled and bundled with Webpack. 

## The problem 

In a build pipeline, we might want to do something like run `lerna run build` to build all the packages, including our final webpacked artifact. 

Ordinarily, this should suffice, as lerna is smart enough to build in topological order (that is `@example/b` will wait until `@example/a` has finished, because the dependency flows that way). 

However, in this scenario `@example/b` _has no build script_. The behaviour lerna currently does is that `@example/c` will attempt to run its build script immediately, and fails because the `@example/a` module isn't ready yet. 

## To repoduce

In the root directory run: 

```
yarn
yarn lerna bootstrap 
yarn lerna run build 

```


You will get this error: 

```
MAC-DJOHNSTON:lerna-topographical-order djohnston$ yarn lerna run build
yarn run v1.22.4
$ /Users/djohnston/git/lerna-topographical-order/node_modules/.bin/lerna run build
lerna notice cli v4.0.0
lerna info Executing command in 2 packages: "yarn run build"
lerna ERR! yarn run build exited 1 in '@example/c'
lerna ERR! yarn run build stdout:
$ webpack
assets by status 1010 bytes [cached] 1 asset
runtime modules 937 bytes 4 modules
cacheable modules 150 bytes
  ./src/c.js 38 bytes [built] [code generated]
  ../b/lib/b.js 112 bytes [built] [code generated]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in ../b/lib/b.js 2:20-41
Module not found: Error: Can't resolve '@example/a' in '/Users/djohnston/git/lerna-topographical-order/packages/b/lib'
resolve '@example/a' in '/Users/djohnston/git/lerna-topographical-order/packages/b/lib'
  Parsed request is a module
  using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/package.json (relative path: ./lib)
    resolve as module
      /Users/djohnston/git/lerna-topographical-order/packages/b/lib/node_modules doesn't exist or is not a directory
      looking for modules in /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules
        single file module
          using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/package.json (relative path: ./node_modules/@example/a)
            no extension
              /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a is not a file
            .js
              /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.js doesn't exist
            .json
              /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.json doesn't exist
            .wasm
              /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.wasm doesn't exist
        existing directory /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a
          using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/package.json (relative path: .)
            using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/package.json (relative path: ./node_modules/@example/a)
              no extension
                /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a is not a file
              .js
                /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.js doesn't exist
              .json
                /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.json doesn't exist
              .wasm
                /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a.wasm doesn't exist
              as directory
                existing directory /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a
                  using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/package.json (relative path: .)
                    use ./lib/index.js from main in package.json
                      using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/package.json (relative path: ./lib/index.js)
                        no extension
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/lib/index.js doesn't exist
                        .js
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/lib/index.js.js doesn't exist
                        .json
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/lib/index.js.json doesn't exist
                        .wasm
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/lib/index.js.wasm doesn't exist
                        as directory
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/lib/index.js doesn't exist
                    using path: /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/index
                      using description file: /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/package.json (relative path: ./index)
                        no extension
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/index doesn't exist
                        .js
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/index.js doesn't exist
                        .json
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/index.json doesn't exist
                        .wasm
                          /Users/djohnston/git/lerna-topographical-order/packages/b/node_modules/@example/a/index.wasm doesn't exist
      /Users/djohnston/git/lerna-topographical-order/packages/node_modules doesn't exist or is not a directory
      looking for modules in /Users/djohnston/git/lerna-topographical-order/node_modules
        single file module
          using description file: /Users/djohnston/git/lerna-topographical-order/package.json (relative path: ./node_modules/@example/a)
            no extension
              /Users/djohnston/git/lerna-topographical-order/node_modules/@example/a doesn't exist
            .js
              /Users/djohnston/git/lerna-topographical-order/node_modules/@example/a.js doesn't exist
            .json
              /Users/djohnston/git/lerna-topographical-order/node_modules/@example/a.json doesn't exist
            .wasm
              /Users/djohnston/git/lerna-topographical-order/node_modules/@example/a.wasm doesn't exist
        /Users/djohnston/git/lerna-topographical-order/node_modules/@example/a doesn't exist
      /Users/djohnston/git/node_modules doesn't exist or is not a directory
      /Users/djohnston/node_modules doesn't exist or is not a directory
      /Users/node_modules doesn't exist or is not a directory
      /node_modules doesn't exist or is not a directory
 @ ./src/c.js 3:0-29 5:0-1

webpack 5.64.3 compiled with 1 error and 1 warning in 242 ms
```


## Workarounds

You have two workarounds 

1. (Preferered) - Add an empty build script to `@example/b` - eg `"build": "echo empty build..."`
2. Add `@example/a` as a dependency or devDependency to `@example/c`. 

