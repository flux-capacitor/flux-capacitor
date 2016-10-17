import test from 'ava'
import bootstrap from '../bootstrap'

test('applying bootstrapper functions', async (t) => {
  const app = {}
  const store = {}

  const bootstrapped = await bootstrap([
    () => ({ app: {} }),
    () => ({ app }),
    () => ({ store })
  ])

  t.deepEqual(Object.keys(bootstrapped), [ 'app', 'store' ])
  t.is(bootstrapped.app, app)
  t.is(bootstrapped.store, store)
})

test('bootstrap() returns a Promise with listen()', (t) => {
  const result = bootstrap([
    () => ({ app: {}, store: {} })
  ])

  t.true(result instanceof Promise, 'Expected bootstrap() result to be a Promise')
  t.is(typeof result.listen, 'function')
})

test('bootstrap() fails when no app or store is set', async (t) => {
  t.plan(2)
  await t.throws(bootstrap([]), /No express app set/)
  await t.throws(bootstrap([
    () => ({ app: {} })
  ]), /No flux capacitor store set/)
})
