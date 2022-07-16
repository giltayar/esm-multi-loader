import loader from '../../../src/esm-multi-loader.js'
export * from '../../../src/esm-multi-loader.js'

import * as quibble from 'quibble'
import * as babelRegisterEsm from 'babel-register-esm'

loader(babelRegisterEsm, quibble)
