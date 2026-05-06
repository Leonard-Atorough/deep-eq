# deep-eq

A small, dependency-free, and type-safe deep equality comparison library for JavaScript and TypeScript.

<!-- [![npm version](https://img.shields.io/npm/v/deep-eq.svg)](https://www.npmjs.com/package/deep-eq)
[![npm downloads](https://img.shields.io/npm/dm/deep-eq.svg)](https://www.npmjs.com/package/deep-eq) -->

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## Features

- **Zero dependencies** — No external packages required
- **Type-safe** — Full TypeScript support with generics
- **Comprehensive type support** — Primitives, objects, arrays, Date, RegExp, Map, Set, TypedArrays, and DataView
- **Circular reference detection** — Handles self-referential structures without infinite loops
- **High performance** — 314% faster than v0.2 on primitives; 100x+ faster than competitors on Map/Set
- **Small footprint** — Optimized for minimal bundle size
- **Modern JavaScript** — ES modules with full Node.js support

## Installation

```bash
npm install deep-eq
```

## Quick Start

```typescript
import deepEqual from "deep-eq";

// Primitives
deepEqual(42, 42); // true
deepEqual("hello", "hello"); // true

// Objects
deepEqual({ x: 1 }, { x: 1 }); // true
deepEqual({ x: 1 }, { x: 2 }); // false

// Arrays
deepEqual([1, 2, 3], [1, 2, 3]); // true
deepEqual([1, 2, 3], [1, 2, 4]); // false

// Special types
deepEqual(new Date("2026-05-02"), new Date("2026-05-02")); // true

deepEqual(/test/i, /test/i); // true

// Collections
deepEqual(
  new Map([
    ["x", 1],
    ["y", 2],
  ]),
  new Map([
    ["x", 1],
    ["y", 2],
  ]),
); // true

deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])); // true

// TypedArrays
deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])); // true

// DataView
const buffer1 = new ArrayBuffer(4);
const view1 = new DataView(buffer1);
view1.setUint8(0, 1);

const buffer2 = new ArrayBuffer(4);
const view2 = new DataView(buffer2);
view2.setUint8(0, 1);

deepEqual(view1, view2); // true

// Circular references
const obj: any = { x: 1 };
obj.self = obj;
deepEqual(obj, obj); // true
```

## API

### `deepEqual<T>(a: T, b: T): boolean`

Compares two values for deep equality.

**Parameters:**

- `a` — First value to compare
- `b` — Second value to compare

**Returns:** `true` if values are deeply equal, `false` otherwise

**Example:**

```typescript
const result = deepEqual({ a: 1 }, { a: 1 });
console.log(result); // true
```

## Supported Types

### Primitives

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `NaN` (correctly identified as equal to NaN)

### Built-in Objects

- `Object` (including nested objects)
- `Array` (including nested arrays)
- `Date`
- `RegExp`

### Collections

- `Map`
- `Set`

### Binary Data

- `TypedArray` — All 11 variants:
  - `Int8Array`
  - `Uint8Array`
  - `Uint8ClampedArray`
  - `Int16Array`
  - `Uint16Array`
  - `Int32Array`
  - `Uint32Array`
  - `Float32Array`
  - `Float64Array`
  - `BigInt64Array`
  - `BigUint64Array`
- `DataView`

### Special Handling

- **Circular references** — Detected and handled via WeakMap
- **Reference equality** — Same object reference returns true
- **NaN handling** — `NaN === NaN` returns true

## Known Limitations

- Does not compare symbol properties
- Does not check prototype chain
- Does not handle Error objects or custom class instances

## Performance

Benchmark results (Node.js v24.6.0):

| Operation            | Ops/sec   |
| -------------------- | --------- |
| Numbers (primitives) | 66.7M     |
| Sets                 | 83.4M     |
| Maps                 | 79.8M     |
| Simple objects       | 52.9M     |
| TypedArrays (1KB)    | 567K      |
| DataView (1KB)       | 1.15M     |
| **Average**          | **37.3M** |

Compared to alternatives:

- **vs lodash-es** — 100x+ faster on Map/Set, 1.4-2x faster on primitives
- **vs fast-deep-equal** — Competitive on objects/arrays, superior on modern types

## Comparison with Alternatives

### vs lodash-es

```typescript
import { isEqual } from "lodash-es";
import deepEqual from "deep-eq";

const map1 = new Map([["x", 1]]);
const map2 = new Map([["x", 1]]);

// lodash-es: ~0.3ms per comparison (thousands of ops/sec)
isEqual(map1, map2);

// deep-eq: ~0.01ms per comparison (tens of millions of ops/sec)
deepEqual(map1, map2);
```

### vs fast-deep-equal

Both libraries offer similar performance on objects and arrays. `deep-eq` includes native support for TypedArrays and DataView without additional dependencies.

## TypeScript

Full TypeScript support with generic type inference:

```typescript
const result = deepEqual<{ x: number }>({ x: 1 }, { x: 1 });
// result is boolean
```

## Browser Support

While designed for Node.js, `deep-eq` works in browsers supporting:

- ES modules
- WeakMap
- TypedArrays (optional, for TypedArray comparisons)

## License

ISC © [Leonard Atorough](https://github.com)

## Contributing

Issues and pull requests welcome on [GitHub](https://github.com).
