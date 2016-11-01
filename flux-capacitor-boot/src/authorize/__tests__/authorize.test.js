import test from 'ava'
import authorize from '../../../authorize'

test(`authorize.allow() does nothing`, (t) => {
  t.notThrows(() => authorize.allow())
})

test(`authorize.deny() works`, (t) => {
  t.throws(() => authorize.deny(), (thrownError) => {
    t.is(thrownError.message, 'Unauthorized')
    t.is(thrownError.statusCode, 401)
    return true
  })
})

test(`authorize.deny(Error) works`, (t) => {
  const error = new Error('Test error')
  t.throws(() => authorize.deny(error), (thrownError) => {
    t.is(thrownError, error)
    t.is(thrownError.statusCode, 401)
    return true
  })
})

test(`authorize.deny(string) works`, (t) => {
  t.throws(() => authorize.deny('Test error'), (thrownError) => {
    t.true(thrownError instanceof Error)
    t.is(thrownError.message, 'Test error')
    t.is(thrownError.statusCode, 401)
    return true
  })
})

test(`authorize.isAuthorized(() => authorize.allow()) works`, (t) => {
  t.true(authorize.isAuthorized(() => authorize.allow()))
})

test(`authorize.isAuthorized(() => authorize.deny()) works`, (t) => {
  t.false(authorize.isAuthorized(() => authorize.deny()))
})
