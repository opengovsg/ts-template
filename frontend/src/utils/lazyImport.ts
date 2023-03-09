import { lazy } from 'react'

/**
 * Creates named imports for `React.lazy`
 *
 * @example
 *   const { Home } = lazyImport(() => import('./Home'), 'Home')
 * @param factory
 *   a function that, when invoked, will import the desired package
 * @param name
 *   the name of the import
 * @returns the desired import, with lazy semantics
 * @see https://github.com/facebook/react/issues/14603#issuecomment-726551598
 */
export function lazyImport<
  T extends React.ComponentType<unknown>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  }) as I
}
