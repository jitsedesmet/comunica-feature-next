import { expect } from '@jest/globals';

// We cannot use native instanceOf to test whether expected is a Term!
function objectsEqual(
  received: unknown,
  expected: unknown,
  selector: (obj: object) => boolean,
  ignoreKeys: string[],
): boolean {
  if (received === undefined || received === null || isPrimitive(received)) {
    return received === expected;
  }

  if (isTerm(received)) {
    // @ts-expect-error TS2345
    return received.equals(expected);
  }
  if (isTerm(expected)) {
    // @ts-expect-error TS2345
    return expected.equals(received);
  }

  if (Array.isArray(received)) {
    if (!Array.isArray(expected)) {
      return false;
    }
    if (received.length !== expected.length) {
      return false;
    }
    for (const [ i, element ] of received.entries()) {
      if (!objectsEqual(element, expected[i], selector, ignoreKeys)) {
        return false;
      }
    }
  } else {
    // Received == object
    if (expected === undefined || expected === null || isPrimitive(expected) || Array.isArray(expected)) {
      return false;
    }
    const keysFirst = Object.keys(received);
    const receivedMatches = selector(received);

    for (const key of keysFirst) {
      if (receivedMatches && ignoreKeys.includes(key)) {
        continue;
      }
      // @ts-expect-error TS7053
      if (!objectsEqual(received[key], expected[key], selector, ignoreKeys)) {
        return false;
      }
    }

    // Ensure no keys are missing in the received object
    const keysSecond = Object.keys(expected);
    for (const key of keysSecond) {
      // @ts-expect-error TS7053
      if (!objectsEqual(received[key], expected[key], selector, ignoreKeys)) {
        return false;
      }
    }
  }
  return true;
}

function isTerm(
  value: unknown,
): value is { equals: (other: { termType: unknown } | undefined | null) => boolean } {
  return typeof value === 'object' && value !== null && 'termType' in value && 'equals' in value;
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualParsedQuery: (expected: unknown) => R;
      toEqualParsedQueryIgnoring: (selector: (obj: object) => boolean, keys: string[], expected: unknown) => R;
    }
  }
}

expect.extend({
  toEqualParsedQuery(received: unknown, expected: unknown) {
    const pass = objectsEqual(received, expected, () => false, []);
    const message = pass ?
      () =>
        `${this.utils.matcherHint('toEqualParsedQuery')}\n\n` +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}` :
      () => {
        const diffString = this.utils.diff(expected, received, {
          expand: this.expand,
        });
        return (
          `${this.utils.matcherHint('toEqualParsedQuery')}\n\n${
            diffString ?
              `Difference:\n\n${diffString}` :
              `Expected: ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(received)}`}`
        );
      };

    return { pass, message };
  },
  toEqualParsedQueryIgnoring(
    received: unknown,
    selector: (obj: object) => boolean,
    ignoreKeys: string[],
    expected: unknown,
  ) {
    const pass = objectsEqual(received, expected, selector, ignoreKeys);
    const message = pass ?
      () =>
        `${this.utils.matcherHint('toEqualParsedQueryIgnoring')}\n\n` +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}` :
      () => {
        const diffString = this.utils.diff(expected, received, {
          expand: this.expand,
        });
        return (
          `${this.utils.matcherHint('toEqualParsedQueryIgnoring')}\n\n${
            diffString ?
              `Difference:\n\n${diffString}` :
              `Expected: ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(received)}`}`
        );
      };

    return { pass, message };
  },
});
