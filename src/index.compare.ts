import { performance } from "perf_hooks";
import deepEqual from "./index.ts";

// Attempt to import comparison libraries
// @ts-ignore
let lodashIsEqual: any = null;
// @ts-ignore
let fastDeepEqual: any = null;

try {
  // @ts-ignore
  const lodash = await import("lodash-es");
  lodashIsEqual = lodash.isEqual;
  console.log("✓ lodash-es loaded");
} catch {
  console.log("⚠ lodash-es not installed (npm install lodash-es)");
}

try {
  // @ts-ignore
  const fast = await import("fast-deep-equal");
  fastDeepEqual = fast.default;
  console.log("✓ fast-deep-equal loaded");
} catch {
  console.log("⚠ fast-deep-equal not installed (npm install fast-deep-equal)");
}

// ============================================================================
// Benchmark Utilities
// ============================================================================

function comparePerformance(testFn: () => void, iterations: number = 100000): string {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    testFn();
  }
  const end = performance.now();
  const time = end - start;
  return time.toFixed(2);
}

function runComparison(
  title: string,
  deepEqFn: () => void,
  lodashFn?: () => void,
  fastFn?: () => void,
  iterations: number = 100000,
) {
  console.log(`\n${title}`);
  console.log("-".repeat(60));

  const deepEqTime = comparePerformance(deepEqFn, iterations);
  console.log(`deep-eq          ${deepEqTime}ms`);

  if (lodashFn && lodashIsEqual) {
    const lodashTime = comparePerformance(lodashFn, iterations);
    const ratio = (parseFloat(lodashTime) / parseFloat(deepEqTime)).toFixed(1);
    console.log(`lodash-es        ${lodashTime}ms (${ratio}x)`);
  }

  if (fastFn && fastDeepEqual) {
    const fastTime = comparePerformance(fastFn, iterations);
    const ratio = (parseFloat(fastTime) / parseFloat(deepEqTime)).toFixed(1);
    console.log(`fast-deep-equal  ${fastTime}ms (${ratio}x)`);
  }
}

// ============================================================================
// Test Fixtures
// ============================================================================

const simpleObj = { x: 1, y: 2 };
const nestedObj = { a: { b: { c: { d: 1 } } } };
const largeObj = {
  id: 1,
  name: "John",
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001",
  },
  hobbies: ["reading", "gaming"],
  created: new Date("2026-05-02"),
};
const largeArray = Array.from({ length: 100 }, (_, i) => ({ id: i }));

const buf = new ArrayBuffer(1000);
const dvA = new DataView(buf);
const dvB = new DataView(buf);
dvA.setUint16(0, 1);
dvB.setUint16(0, 1);

const taA = new Uint8Array(1000);
taA.fill(1);
const taB = new Uint8Array(1000);
taB.fill(1);

// ============================================================================
// Comparisons
// ============================================================================

console.log("\n" + "=".repeat(60));
console.log("DEEP EQUALITY LIBRARY COMPARISON");
console.log("=".repeat(60));

// Primitives
runComparison(
  "Primitives: Simple Numbers",
  () => deepEqual(42, 42),
  () => lodashIsEqual?.(42, 42),
  () => fastDeepEqual?.(42, 42),
);

// Simple objects
runComparison(
  "Objects: Simple Object",
  () => deepEqual(simpleObj, simpleObj),
  () => lodashIsEqual?.(simpleObj, simpleObj),
  () => fastDeepEqual?.(simpleObj, simpleObj),
);

// Nested objects
runComparison(
  "Objects: Nested 4 Levels",
  () => deepEqual(nestedObj, nestedObj),
  () => lodashIsEqual?.(nestedObj, nestedObj),
  () => fastDeepEqual?.(nestedObj, nestedObj),
);

// Complex object
runComparison(
  "Objects: Large Complex Object",
  () => deepEqual(largeObj, largeObj),
  () => lodashIsEqual?.(largeObj, largeObj),
  () => fastDeepEqual?.(largeObj, largeObj),
  50000,
);

// Large arrays
runComparison(
  "Arrays: 100 Item Array",
  () => deepEqual(largeArray, largeArray),
  () => lodashIsEqual?.(largeArray, largeArray),
  () => fastDeepEqual?.(largeArray, largeArray),
  50000,
);

// Date comparison
runComparison(
  "Special Types: Date",
  () => deepEqual(new Date("2026-05-02"), new Date("2026-05-02")),
  () => lodashIsEqual?.(new Date("2026-05-02"), new Date("2026-05-02")),
  () => fastDeepEqual?.(new Date("2026-05-02"), new Date("2026-05-02")),
);

// RegExp comparison
runComparison(
  "Special Types: RegExp",
  () => deepEqual(/test/i, /test/i),
  () => lodashIsEqual?.(/test/i, /test/i),
  () => fastDeepEqual?.(/test/i, /test/i),
);

// Map comparison
runComparison(
  "Collections: Map",
  () => deepEqual(new Map([["x", 1]]), new Map([["x", 1]])),
  () => lodashIsEqual?.(new Map([["x", 1]]), new Map([["x", 1]])),
  () => fastDeepEqual?.(new Map([["x", 1]]), new Map([["x", 1]])),
);

// Set comparison
runComparison(
  "Collections: Set",
  () => deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])),
  () => lodashIsEqual?.(new Set([1, 2, 3]), new Set([1, 2, 3])),
  () => fastDeepEqual?.(new Set([1, 2, 3]), new Set([1, 2, 3])),
);

// Inequality
runComparison(
  "Inequality: Different Primitives",
  () => deepEqual(1, 2),
  () => lodashIsEqual?.(1, 2),
  () => fastDeepEqual?.(1, 2),
);

runComparison(
  "Inequality: Different Objects",
  () => deepEqual({ x: 1 }, { x: 2 }),
  () => lodashIsEqual?.({ x: 1 }, { x: 2 }),
  () => fastDeepEqual?.({ x: 1 }, { x: 2 }),
);

runComparison(
  "ArrayBuffer: DataView",
  () => deepEqual(dvA, dvB),
  () => lodashIsEqual?.(dvA, dvB),
  () => fastDeepEqual?.(dvA, dvB),
);

runComparison(
  "ArrayBuffer: TypedArray",
  () => deepEqual(taA, taB),
  () => lodashIsEqual?.(taA, taB),
  () => fastDeepEqual?.(taA, taB),
);

console.log("\n" + "=".repeat(60));
console.log("NOTES:");
console.log("- Lower time is better");
console.log("- Ratio shows relative performance vs deep-eq");
console.log("- Install comparison libraries: npm install lodash-es fast-deep-equal");
console.log("=".repeat(60) + "\n");
