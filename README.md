# esm-multi-loader

An ESM loader that can chain multiple loaders together. Supports both the old and the new ESM
loader interface.

A major portion of the code was copied [with permission](https://github.com/targos/multiloader/blob/abc3fedc4201c52c0485c6b8b32cd929c0e1cf8f/LICENSE) from <https://github.com/targos/multiloader/blob/abc3fedc4201c52c0485c6b8b32cd929c0e1cf8f/packages/multiloader-loader/src/loader.js>. It was
upgraded to support the new version of the ESM loader interface, and was added the ability to
take the loader configuration from an environment variable

For more information on Node.js ESM loaders,
see [here](https://nodejs.org/api/esm.html#esm_loaders).

## Installation

```sh
npm install esm-multi-loader
```

## Usage

To support loading multiple loaders, define an environment variable with the loaders, separated
by `,`, and add this loader as the loader for Node.js.

Example:

```js
// a-file-with-jsx-and-esm-mocking.js
import React from 'react'
import quibble from 'quibble'

await quibble.esm('./foo.mjs', {a: 42})

console.log((<button>Hi</button>).type)

console.log((await import('./foo.mjs')).a)
```

Because it needs the `babel-register-esm` and `quibble` loaders, you need to `npm install` them
both, and then run it thus with Node.s:

```shell
ESM_MULTI_LOADER=babel-register-esm,quibble node --loader esm-multi-loader a-file-with-jsx-and-esm-mocking.mjs
```

Note that in order for this to work, you need the appropriate `babelrc.json` and plugins installed.
E.g., for this example to work, you need to npm-install `@babel/plugin-transform-react-jsx"` and
your `babelrc.json` needs to look something like this:

```json
{
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

## Usage in Mocha (and probably other test-runners)

To use it in Mocha, add `loader=esm-multi-loader` to the mocha arguments, e.g.

```shell
mocha --loader=esm-multi-loader some-test.js
```

## API

Instead of loading the loaders via the environment variable, you can instead use
the `configureLoader` API that is exported by this module, thus:

```js
// my-loader.mjs
import loader from './packages/multiloader-loader/src/loader.js';
export * from './packages/multiloader-loader/src/loader.js';

import * as quibble from 'quibble'
import * as babelRegisterEsm from 'babel-register-esm'

loader(
  quibble,
  babelRegisterEsm,
);
```

And use the above file as the loader, thus:

```shell
node --loader=./my-loader.mjs a-file-with-jsx-and-esm-mocking.mjs
```

This will achieve the same result as using:

```shell
ESM_MULTI_LOADER=babel-register-esm,quibble node --loader esm-multi-loader a-file-with-jsx-and-esm-mocking.mjs
```

### License

MIT
