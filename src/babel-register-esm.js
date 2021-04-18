import path from 'path'
import {fileURLToPath} from 'url'
import babel from '@babel/core'

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']

/**
 * @param {string} url
 * @param {Object} context
 * @param {Function} defaultGetFormat
 * @returns {Promise<{ format: string }>}
 */
export async function getFormat(url, context, defaultGetFormat) {
  const urlUrl = new URL(url)

  if (urlUrl.protocol === 'file:') {
    const extension = path.extname(fileURLToPath(url))

    if (SUPPORTED_EXTENSIONS.includes(extension)) {
      return defaultGetFormat(url.slice(0, -extension.length) + '.js', context, defaultGetFormat)
    }
  }
  return defaultGetFormat(url, context, defaultGetFormat)
}

/**
 * @param {!(string | SharedArrayBuffer | Uint8Array)} source
 * @param {{
 *   format: string,
 *   url: string,
 * }} context
 * @param {Function} defaultTransformSource
 * @returns {Promise<{ source: !(string | SharedArrayBuffer | Uint8Array) }>}
 */
export async function transformSource(source, context, defaultTransformSource) {
  const {url, format} = context
  if (format !== 'module') return defaultTransformSource(source, context, defaultTransformSource)

  const stringSource =
    typeof source === 'string'
      ? source
      : Buffer.isBuffer(source)
      ? source.toString('utf-8')
      : Buffer.from(source).toString('utf-8')

  const sourceCode = (
    await babel.transformAsync(stringSource, {
      sourceType: 'module',
      filename: fileURLToPath(url),
    })
  )?.code

  return sourceCode
    ? {
        source: sourceCode,
      }
    : defaultTransformSource(source, context, defaultTransformSource)
}