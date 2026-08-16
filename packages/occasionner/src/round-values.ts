/**
 * Yields ‘round’ values in ascending order: all positive integers with at most
 * two significant digits (1, 2 … 9, 10, 11 … 99, 100, 110 … 990, 1000, 1100 …).
 */
export function* generateRoundValues(): Generator<number> {
  for (let value = 1; value < 10; value += 1) {
    yield value;
  }
  for (let magnitude = 1; ; magnitude *= 10) {
    for (let mantissa = 10; mantissa < 100; mantissa += 1) {
      yield mantissa * magnitude;
    }
  }
}
