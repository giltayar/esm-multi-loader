import path from 'path'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {execa} from 'execa'

const __dirname = new URL('.', import.meta.url).pathname

describe('esm-multi-loader (e2e)', function () {
  const fixtures = path.resolve(__dirname, 'fixtures')

  it('should run loaders via configuration api', async () => {
    const {stdout: result} = await execa('node', [
      '--no-warnings',
      '--loader',
      path.resolve(fixtures, 'test-loaders.mjs'),
      path.resolve(fixtures, 'uses-loaders.mjs'),
    ])
    expect(result).to.equal('div 42')
  })

  it('should run loaders via environment variable', async () => {
    const {stdout: result} = await execa(
      'node',
      ['--no-warnings', '--loader', 'esm-multi-loader', path.resolve(fixtures, 'uses-loaders.mjs')],
      {
        env: {
          ESM_MULTI_LOADER: 'babel-register-esm,quibble',
        },
        extendEnv: true,
      },
    )
    expect(result).to.equal('div 42')
  })

  it('should run one loaders via configuration api', async () => {
    const {stdout: result} = await execa('node', [
      '--no-warnings',
      '--loader',
      path.resolve(fixtures, 'test-loader.mjs'),
      path.resolve(fixtures, 'uses-one-loader.mjs'),
    ])
    expect(result).to.equal('div')
  })

  it('should run one loader via environment variable', async () => {
    const {stdout: result} = await execa(
      'node',
      [
        '--no-warnings',
        '--loader',
        'esm-multi-loader',
        path.resolve(fixtures, 'uses-one-loader.mjs'),
      ],
      {
        env: {
          ESM_MULTI_LOADER: 'babel-register-esm',
        },
        extendEnv: true,
      },
    )
    expect(result).to.equal('div')
  })
})
