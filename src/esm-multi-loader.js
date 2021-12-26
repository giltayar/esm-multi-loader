const resolveHooks = {
  name: 'resolve',
  hooks: /**@type {any[]}*/ ([]),
}

const getFormatHooks = {
  name: 'getFormat',
  hooks: /**@type {any[]}*/ ([]),
}

const getSourceHooks = {
  name: 'getSource',
  hooks: /**@type {any[]}*/ ([]),
}

const transformSourceHooks = {
  name: 'transformSource',
  hooks: /**@type {any[]}*/ ([]),
}

const loadHooks = {
  name: 'load',
  hooks: /**@type {any[]}*/ ([]),
}

const hooks = [resolveHooks, getFormatHooks, getSourceHooks, transformSourceHooks, loadHooks]

if (process.env.ESM_MULTI_LOADER) {
  configureLoader(
    ...(await Promise.all(process.env.ESM_MULTI_LOADER.split(/[,;]/).map((p) => import(p)))),
  )
}

/**
 * @param {any[]} loaders
 */
export default function configureLoader(...loaders) {
  for (const loader of loaders) {
    for (const hook of hooks) {
      if (loader[hook.name]) {
        hook.hooks.push(loader[hook.name])
      }
    }
  }
}

/**
 * @param {any} specifier
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultResolve
 */
export async function resolve(specifier, context, defaultResolve, index = 0) {
  if (resolveHooks.hooks[index]) {
    return resolveHooks.hooks[index](
      specifier,
      context,
      (/** @type {any} */ s, /** @type {any} */ c) => resolve(s, c, defaultResolve, index + 1),
    )
  }
  return defaultResolve(specifier, context, defaultResolve)
}

/**
 * @param {any} specifier
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultGetFormat
 */
export async function getFormat(specifier, context, defaultGetFormat, index = 0) {
  if (getFormatHooks.hooks[index]) {
    return getFormatHooks.hooks[index](
      specifier,
      context,
      (/** @type {any} */ s, /** @type {any} */ c) => getFormat(s, c, defaultGetFormat, index + 1),
    )
  }
  return defaultGetFormat(specifier, context, defaultGetFormat)
}

/**
 * @param {any} specifier
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultGetSource
 */
export async function getSource(specifier, context, defaultGetSource, index = 0) {
  if (getSourceHooks.hooks[index]) {
    return getSourceHooks.hooks[index](
      specifier,
      context,
      (/** @type {any} */ s, /** @type {any} */ c) => getSource(s, c, defaultGetSource, index + 1),
    )
  }
  return defaultGetSource(specifier, context, defaultGetSource)
}

/**
 * @param {any} specifier
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultTransformSource
 */
export async function transformSource(specifier, context, defaultTransformSource, index = 0) {
  if (transformSourceHooks.hooks[index]) {
    return transformSourceHooks.hooks[index](
      specifier,
      context,
      (/** @type {any} */ s, /** @type {any} */ c) =>
        transformSource(s, c, defaultTransformSource, index + 1),
    )
  }
  return defaultTransformSource(specifier, context, defaultTransformSource)
}

/**
 * @param {any} specifier
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultLoad
 */
export async function load(specifier, context, defaultLoad, index = 0) {
  if (loadHooks.hooks[index]) {
    return loadHooks.hooks[index](
      specifier,
      context,
      (/** @type {any} */ s, /** @type {any} */ c) => load(s, c, defaultLoad, index + 1),
    )
  }
  return defaultLoad(specifier, context, defaultLoad)
}
