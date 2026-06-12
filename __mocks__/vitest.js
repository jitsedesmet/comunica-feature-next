// Stub for vitest when running under jest.
// @traqula/test-utils imports vitest to call expect.extend(), use it/describe,
// and passes test context ({ expect }) to test callbacks.
// Under jest we extend expect ourselves in jest.setup.ts, globals are available,
// and we wrap `it` to inject { expect } into the test context.
const expect = {
  extend: () => {},
};

function wrapCallback(fn) {
  if (typeof fn !== 'function') {
    return fn;
  }
  return function(...args) {
    return fn.call(this, { expect: globalThis.expect, ...args[0] }, ...args.slice(1));
  };
}

const it = Object.assign(
  (name, fn, timeout) => globalThis.it(name, wrapCallback(fn), timeout),
  {
    todo: name => globalThis.it.todo(name),
    skip: (name, fn, timeout) => globalThis.it.skip(name, wrapCallback(fn), timeout),
    only: (name, fn, timeout) => globalThis.it.only(name, wrapCallback(fn), timeout),
    each: (...args) => globalThis.it.each(...args),
  },
);

const describe = Object.assign(
  (name, fn) => globalThis.describe(name, fn),
  {
    skip: (name, fn) => globalThis.describe.skip(name, fn),
    only: (name, fn) => globalThis.describe.only(name, fn),
  },
);

module.exports = {
  expect,
  it,
  describe,
  test: it,
  beforeEach: globalThis.beforeEach,
  afterEach: globalThis.afterEach,
  beforeAll: globalThis.beforeAll,
  afterAll: globalThis.afterAll,
};
