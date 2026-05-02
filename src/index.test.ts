import assert from "assert";
import deepEqual from "./index.ts";

// Test utilities
let testCount = 0;
let passedCount = 0;
let failedCount = 0;

function test(name: string, fn: () => void) {
  testCount++;
  try {
    fn();
    passedCount++;
    console.log(`✓ ${name}`);
  } catch (error) {
    failedCount++;
    console.error(`✗ ${name}`);
    console.error(`  ${(error as Error).message}`);
  }
}

// ============================================================================
// Primitives
// ============================================================================

console.log("\n=== Primitives ===");

test("should return true for identical strings", () => {
  assert.strictEqual(deepEqual("hello", "hello"), true);
});

test("should return false for different strings", () => {
  assert.strictEqual(deepEqual("hello", "world"), false);
});

test("should return true for identical numbers", () => {
  assert.strictEqual(deepEqual(42, 42), true);
});

test("should return false for different numbers", () => {
  assert.strictEqual(deepEqual(42, 43), false);
});

test("should return true for identical booleans", () => {
  assert.strictEqual(deepEqual(true, true), true);
});

test("should return false for different booleans", () => {
  assert.strictEqual(deepEqual(true, false), false);
});

test("should return true for both null", () => {
  assert.strictEqual(deepEqual(null, null), true);
});

test("should return false for null vs undefined", () => {
  assert.strictEqual(deepEqual(null, undefined), false);
});

test("should handle NaN correctly", () => {
  assert.strictEqual(deepEqual(NaN, NaN), true);
});

// ============================================================================
// Arrays
// ============================================================================

console.log("\n=== Arrays ===");

test("should return true for identical empty arrays", () => {
  assert.strictEqual(deepEqual([], []), true);
});

test("should return true for identical number arrays", () => {
  assert.strictEqual(deepEqual([1, 2, 3], [1, 2, 3]), true);
});

test("should return false for arrays with different lengths", () => {
  assert.strictEqual(deepEqual([1, 2], [1, 2, 3]), false);
});

test("should return false for arrays with different elements", () => {
  assert.strictEqual(deepEqual([1, 2, 3], [1, 2, 4]), false);
});

test("should handle nested arrays", () => {
  assert.strictEqual(
    deepEqual(
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 2],
        [3, 4],
      ],
    ),
    true,
  );
});

test("should return false for different nested arrays", () => {
  assert.strictEqual(
    deepEqual(
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 2],
        [3, 5],
      ],
    ),
    false,
  );
});

test("should handle arrays with mixed types", () => {
  assert.strictEqual(deepEqual([1, "hello", true, null], [1, "hello", true, null]), true);
});

test("should handle arrays with NaN", () => {
  assert.strictEqual(deepEqual([NaN, 1], [NaN, 1]), true);
});

// ============================================================================
// Objects
// ============================================================================

console.log("\n=== Objects ===");

test("should return true for identical empty objects", () => {
  assert.strictEqual(deepEqual({}, {}), true);
});

test("should return true for identical simple objects", () => {
  assert.strictEqual(deepEqual({ x: 1, y: 2 }, { x: 1, y: 2 }), true);
});

test("should return true for identical objects with different key order", () => {
  assert.strictEqual(deepEqual({ x: 1, y: 2 }, { y: 2, x: 1 }), true);
});

test("should return false for objects with different values", () => {
  assert.strictEqual(deepEqual({ x: 1 }, { x: 2 }), false);
});

test("should return false for objects with different keys", () => {
  assert.strictEqual(deepEqual({ x: 1 }, { y: 1 }), false);
});

test("should return false for objects with different number of keys", () => {
  assert.strictEqual(deepEqual({ x: 1 }, { x: 1, y: 2 }), false);
});

test("should handle nested objects", () => {
  assert.strictEqual(
    deepEqual({ user: { name: "Alice", age: 30 } }, { user: { name: "Alice", age: 30 } }),
    true,
  );
});

test("should return false for different nested objects", () => {
  assert.strictEqual(
    deepEqual({ user: { name: "Alice", age: 30 } }, { user: { name: "Bob", age: 30 } }),
    false,
  );
});

test("should handle objects with null values", () => {
  assert.strictEqual(deepEqual({ x: null }, { x: null }), true);
});

test("should handle objects with mixed types", () => {
  assert.strictEqual(
    deepEqual(
      { str: "hello", num: 42, bool: true, nil: null },
      { str: "hello", num: 42, bool: true, nil: null },
    ),
    true,
  );
});

// ============================================================================
// Dates
// ============================================================================

console.log("\n=== Dates ===");

test("should return true for identical dates", () => {
  const date1 = new Date("2026-05-02");
  const date2 = new Date("2026-05-02");
  assert.strictEqual(deepEqual(date1, date2), true);
});

test("should return false for different dates", () => {
  const date1 = new Date("2026-05-02");
  const date2 = new Date("2026-05-03");
  assert.strictEqual(deepEqual(date1, date2), false);
});

test("should handle dates in arrays", () => {
  const date1 = new Date("2026-05-02");
  const date2 = new Date("2026-05-02");
  assert.strictEqual(deepEqual([date1], [date2]), true);
});

test("should handle dates in objects", () => {
  const date1 = new Date("2026-05-02");
  const date2 = new Date("2026-05-02");
  assert.strictEqual(deepEqual({ created: date1 }, { created: date2 }), true);
});

// ============================================================================
// RegExp
// ============================================================================

console.log("\n=== RegExp ===");

test("should return true for identical regexes", () => {
  assert.strictEqual(deepEqual(/test/i, /test/i), true);
});

test("should return false for regexes with different patterns", () => {
  assert.strictEqual(deepEqual(/test/, /hello/), false);
});

test("should return false for regexes with different flags", () => {
  assert.strictEqual(deepEqual(/test/i, /test/g), false);
});

test("should handle regexes in arrays", () => {
  assert.strictEqual(deepEqual([/test/i], [/test/i]), true);
});

test("should handle regexes in objects", () => {
  assert.strictEqual(deepEqual({ pattern: /test/gi }, { pattern: /test/gi }), true);
});

// ============================================================================
// Maps
// ============================================================================

console.log("\n=== Maps ===");

test("should return true for identical empty maps", () => {
  assert.strictEqual(deepEqual(new Map(), new Map()), true);
});

test("should return true for identical maps with primitives", () => {
  const map1 = new Map([
    ["x", 1],
    ["y", 2],
  ]);
  const map2 = new Map([
    ["x", 1],
    ["y", 2],
  ]);
  assert.strictEqual(deepEqual(map1, map2), true);
});

test("should return false for maps with different values", () => {
  const map1 = new Map([["x", 1]]);
  const map2 = new Map([["x", 2]]);
  assert.strictEqual(deepEqual(map1, map2), false);
});

test("should return false for maps with different sizes", () => {
  const map1 = new Map([["x", 1]]);
  const map2 = new Map([
    ["x", 1],
    ["y", 2],
  ]);
  assert.strictEqual(deepEqual(map1, map2), false);
});

test("should handle maps with nested objects", () => {
  const map1 = new Map([["obj", { x: 1 }]]);
  const map2 = new Map([["obj", { x: 1 }]]);
  assert.strictEqual(deepEqual(map1, map2), true);
});

test("should return false for maps with different nested objects", () => {
  const map1 = new Map([["obj", { x: 1 }]]);
  const map2 = new Map([["obj", { x: 2 }]]);
  assert.strictEqual(deepEqual(map1, map2), false);
});

// ============================================================================
// Sets
// ============================================================================

console.log("\n=== Sets ===");

test("should return true for identical empty sets", () => {
  assert.strictEqual(deepEqual(new Set(), new Set()), true);
});

test("should return true for identical sets with primitives", () => {
  const set1 = new Set([1, 2, 3]);
  const set2 = new Set([1, 2, 3]);
  assert.strictEqual(deepEqual(set1, set2), true);
});

test("should return true for sets with different order but same elements", () => {
  const set1 = new Set([1, 2, 3]);
  const set2 = new Set([3, 2, 1]);
  assert.strictEqual(deepEqual(set1, set2), true);
});

test("should return false for sets with different elements", () => {
  const set1 = new Set([1, 2, 3]);
  const set2 = new Set([1, 2, 4]);
  assert.strictEqual(deepEqual(set1, set2), false);
});

test("should return false for sets with different sizes", () => {
  const set1 = new Set([1, 2]);
  const set2 = new Set([1, 2, 3]);
  assert.strictEqual(deepEqual(set1, set2), false);
});

test("should handle sets with nested objects", () => {
  const set1 = new Set([{ x: 1 }, { x: 2 }]);
  const set2 = new Set([{ x: 1 }, { x: 2 }]);
  assert.strictEqual(deepEqual(set1, set2), true);
});

test("should handle sets with NaN", () => {
  const set1 = new Set([NaN, 1, 2]);
  const set2 = new Set([NaN, 1, 2]);
  assert.strictEqual(deepEqual(set1, set2), true);
});

// ============================================================================
// Complex Nested Structures
// ============================================================================

console.log("\n=== Complex Nested Structures ===");

test("should handle complex nested structures", () => {
  const obj1 = {
    id: 1,
    user: {
      name: "Alice",
      created: new Date("2026-05-02"),
      tags: ["admin", "user"],
      metadata: new Map([["key", { x: 1 }]]),
    },
    patterns: [/test/i, /hello/g],
    items: new Set([1, 2, { y: 3 }]),
  };

  const obj2 = {
    id: 1,
    user: {
      name: "Alice",
      created: new Date("2026-05-02"),
      tags: ["admin", "user"],
      metadata: new Map([["key", { x: 1 }]]),
    },
    patterns: [/test/i, /hello/g],
    items: new Set([1, 2, { y: 3 }]),
  };

  assert.strictEqual(deepEqual(obj1, obj2), true);
});

test("should return false for complex structures with one difference", () => {
  const obj1 = {
    id: 1,
    user: {
      name: "Alice",
      tags: ["admin"],
    },
  };

  const obj2 = {
    id: 1,
    user: {
      name: "Bob",
      tags: ["admin"],
    },
  };

  assert.strictEqual(deepEqual(obj1, obj2), false);
});

// ============================================================================
// Type Mismatches
// ============================================================================

console.log("\n=== Type Mismatches ===");

test("should return false for array vs object", () => {
  assert.strictEqual(deepEqual([1, 2], { 0: 1, 1: 2 }), false);
});

test("should return false for map vs object", () => {
  const map = new Map([["x", 1]]);
  assert.strictEqual(deepEqual(map as any, { x: 1 }), false);
});

test("should return false for set vs array", () => {
  const set = new Set([1, 2, 3]);
  assert.strictEqual(deepEqual(set as any, [1, 2, 3]), false);
});

test("should return false for date vs string", () => {
  const date = new Date("2026-05-02");
  assert.strictEqual(deepEqual(date as any, "2026-05-02"), false);
});

test("should return false for regex vs string", () => {
  assert.strictEqual(deepEqual(/test/ as any, "/test/"), false);
});

// ============================================================================
// Circular References
// ============================================================================

console.log("\n=== Circular References ===");

test("should handle simple circular reference", () => {
  const a: any = { x: 1 };
  a.self = a;

  assert.strictEqual(deepEqual(a, a), true);
});

test("should handle circular reference in arrays", () => {
  const arr: any = [1, 2];
  arr.push(arr);

  assert.strictEqual(deepEqual(arr, arr), true);
});

test("should detect difference in circular structures", () => {
  const a: any = { x: 1 };
  a.self = a;

  const b: any = { x: 2 };
  b.self = b;

  assert.strictEqual(deepEqual(a, b), false);
});

// ============================================================================
// Reference Equality
// ============================================================================

console.log("\n=== Reference Equality ===");

test("should return true for same object reference", () => {
  const obj = { x: 1 };
  assert.strictEqual(deepEqual(obj, obj), true);
});

test("should return true for same array reference", () => {
  const arr = [1, 2, 3];
  assert.strictEqual(deepEqual(arr, arr), true);
});

test("should return true for same date reference", () => {
  const date = new Date();
  assert.strictEqual(deepEqual(date, date), true);
});

// ============================================================================
// TypedArrays
// ============================================================================

console.log("\n=== TypedArrays ===");

test("should return true for identical Int8Array", () => {
  const arr1 = new Int8Array([1, 2, 3]);
  const arr2 = new Int8Array([1, 2, 3]);
  assert.strictEqual(deepEqual(arr1, arr2), true);
});

test("should return true for identical Uint8Array", () => {
  const arr1 = new Uint8Array([1, 2, 3]);
  const arr2 = new Uint8Array([1, 2, 3]);
  assert.strictEqual(deepEqual(arr1, arr2), true);
});

test("should return true for identical Float32Array", () => {
  const arr1 = new Float32Array([1.5, 2.5, 3.5]);
  const arr2 = new Float32Array([1.5, 2.5, 3.5]);
  assert.strictEqual(deepEqual(arr1, arr2), true);
});

test("should return true for identical Float64Array", () => {
  const arr1 = new Float64Array([1.5, 2.5, 3.5]);
  const arr2 = new Float64Array([1.5, 2.5, 3.5]);
  assert.strictEqual(deepEqual(arr1, arr2), true);
});

test("should return false for different TypedArrays", () => {
  const arr1 = new Int8Array([1, 2, 3]);
  const arr2 = new Int8Array([1, 2, 4]);
  assert.strictEqual(deepEqual(arr1, arr2), false);
});

test("should return false for different TypedArray lengths", () => {
  const arr1 = new Uint8Array([1, 2, 3]);
  const arr2 = new Uint8Array([1, 2]);
  assert.strictEqual(deepEqual(arr1, arr2), false);
});

test("should return false for different TypedArray types", () => {
  const arr1 = new Int8Array([1, 2, 3]);
  const arr2 = new Uint8Array([1, 2, 3]);
  assert.strictEqual(deepEqual(arr1, arr2 as any), false);
});

test("should handle TypedArrays in arrays", () => {
  const arr1 = [new Int8Array([1, 2]), 42];
  const arr2 = [new Int8Array([1, 2]), 42];
  assert.strictEqual(deepEqual(arr1, arr2), true);
});

test("should handle TypedArrays in objects", () => {
  const obj1 = { data: new Float32Array([1.5, 2.5]) };
  const obj2 = { data: new Float32Array([1.5, 2.5]) };
  assert.strictEqual(deepEqual(obj1, obj2), true);
});

// ============================================================================
// DataView
// ============================================================================

console.log("\n=== DataView ===");

test("should return true for identical DataView", () => {
  const buffer1 = new ArrayBuffer(4);
  const view1 = new DataView(buffer1);
  view1.setUint8(0, 1);
  view1.setUint8(1, 2);

  const buffer2 = new ArrayBuffer(4);
  const view2 = new DataView(buffer2);
  view2.setUint8(0, 1);
  view2.setUint8(1, 2);

  assert.strictEqual(deepEqual(view1, view2), true);
});

test("should return false for different DataView content", () => {
  const buffer1 = new ArrayBuffer(4);
  const view1 = new DataView(buffer1);
  view1.setUint8(0, 1);

  const buffer2 = new ArrayBuffer(4);
  const view2 = new DataView(buffer2);
  view2.setUint8(0, 2);

  assert.strictEqual(deepEqual(view1, view2), false);
});

test("should return false for different DataView length", () => {
  const buffer1 = new ArrayBuffer(2);
  const view1 = new DataView(buffer1);

  const buffer2 = new ArrayBuffer(4);
  const view2 = new DataView(buffer2);

  assert.strictEqual(deepEqual(view1, view2), false);
});

test("should return false for TypedArray vs DataView", () => {
  const typedArr = new Uint8Array([1, 2, 3]);
  const buffer = new ArrayBuffer(3);
  const view = new DataView(buffer);

  assert.strictEqual(deepEqual(typedArr as any, view as any), false);
});

test("should handle DataView in objects", () => {
  const buffer1 = new ArrayBuffer(2);
  const view1 = new DataView(buffer1);
  view1.setUint8(0, 42);

  const buffer2 = new ArrayBuffer(2);
  const view2 = new DataView(buffer2);
  view2.setUint8(0, 42);

  assert.strictEqual(deepEqual({ buffer: view1 }, { buffer: view2 }), true);
});

// ============================================================================
// Test Results
// ============================================================================

console.log("\n" + "=".repeat(50));
console.log(`Total: ${testCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
console.log("=".repeat(50));

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("\nAll tests passed! ✓");
}
