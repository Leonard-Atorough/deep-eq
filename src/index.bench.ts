import { performance } from "perf_hooks";
import deepEqual from "./index.ts";

interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  opsPerSec: number;
}

const results: BenchmarkResult[] = [];

function benchmark(name: string, fn: () => void, iterations: number = 100000): BenchmarkResult {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;
  const opsPerSec = (iterations / totalTime) * 1000;

  const result: BenchmarkResult = {
    name,
    iterations,
    totalTime,
    avgTime,
    opsPerSec,
  };

  results.push(result);
  return result;
}

function formatResult(result: BenchmarkResult): string {
  return `${result.name.padEnd(40)} ${result.totalTime.toFixed(2).padStart(8)}ms (${result.opsPerSec.toFixed(0).padStart(12)} ops/sec)`;
}

// Test Fixtures
const simpleObj = { x: 1, y: 2 };
const nestedObj = { a: { b: { c: { d: { e: 1 } } } } };
const largeObj = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001",
    coords: { lat: 40.7128, lng: -74.006 },
  },
  hobbies: ["reading", "gaming", "coding"],
  metadata: {
    created: new Date("2026-05-02"),
    updated: new Date("2026-05-02"),
    tags: ["important", "verified"],
  },
};

const largeArray = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  value: Math.random(),
}));

const circularObj: any = { x: 1 };
circularObj.self = circularObj;

const mapObj = new Map<string, any>([
  ["key1", { nested: true }],
  ["key2", [1, 2, 3]],
  ["key3", new Date("2026-05-02")],
]);

const setObj = new Set([1, 2, 3, { x: 1 }, new Date("2026-05-02")]);

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
// Test Fixtures
// ============================================================================

// Run benchmarks
console.log("\n" + "=".repeat(70));
console.log("DEEP-EQ BENCHMARKING SUITE (Node.js perf_hooks)");
console.log("=".repeat(70));

console.log("\n=== Primitive Types ===");
benchmark("Numbers (equal)", () => deepEqual(42, 42));
benchmark("Strings (equal)", () => deepEqual("hello", "hello"));
benchmark("Booleans (equal)", () => deepEqual(true, true));
benchmark("NaN (equal)", () => deepEqual(NaN, NaN));
benchmark("null (equal)", () => deepEqual(null, null));

console.log("\n=== Simple Objects ===");
benchmark("Simple object (equal)", () => deepEqual(simpleObj, simpleObj));
benchmark("Empty object (equal)", () => deepEqual({}, {}));
benchmark("Object (not equal)", () => deepEqual(simpleObj, { x: 1, y: 3 }));

console.log("\n=== Nested Structures ===");
benchmark("Nested 2 levels", () => deepEqual({ a: { b: 1 } }, { a: { b: 1 } }));
benchmark("Nested 5 levels", () => deepEqual(nestedObj, nestedObj));
benchmark("Large complex object", () => deepEqual(largeObj, largeObj), 50000);

console.log("\n=== Arrays ===");
benchmark("Small array [1,2,3]", () => deepEqual([1, 2, 3], [1, 2, 3]));
benchmark("Medium array (10 items)", () => deepEqual([...Array(10)], [...Array(10)]));
benchmark("Large array (100 items)", () => deepEqual(largeArray, largeArray), 50000);

console.log("\n=== Special Types ===");
benchmark("Date (equal)", () => deepEqual(new Date("2026-05-02"), new Date("2026-05-02")));
benchmark("RegExp (equal)", () => deepEqual(/test/i, /test/i));

console.log("\n=== Collections ===");
benchmark("Map (equal)", () => deepEqual(mapObj, mapObj));
benchmark("Set (equal)", () => deepEqual(setObj, setObj));

console.log("\n=== TypedArrays ===");
benchmark("Uint8Array (1k bytes)", () => deepEqual(taA, taB));
benchmark("Float32Array", () =>
  deepEqual(new Float32Array([1.5, 2.5, 3.5]), new Float32Array([1.5, 2.5, 3.5])),
);

console.log("\n=== DataView ===");
benchmark("DataView (1k bytes)", () => deepEqual(dvA, dvB));

console.log("\n=== Circular References ===");
benchmark("Simple circular reference", () => deepEqual(circularObj, circularObj));

// Print summary
console.log("\n" + "=".repeat(70));
console.log("RESULTS SUMMARY");
console.log("=".repeat(70));
console.log();

const categoryGroups = [
  { name: "Primitives", count: 5 },
  { name: "Simple Objects", count: 3 },
  { name: "Nested Structures", count: 3 },
  { name: "Arrays", count: 3 },
  { name: "Special Types", count: 2 },
  { name: "Collections", count: 2 },
  { name: "TypedArrays", count: 2 },
  { name: "DataView", count: 1 },
  { name: "Circular References", count: 1 },
];

let index = 0;
for (const category of categoryGroups) {
  console.log(`${category.name}:`);
  for (let i = 0; i < category.count; i++) {
    console.log(`  ${formatResult(results[index++]!)}`);
  }
  console.log();
}

// Calculate statistics
const avgOpsPerSec = results.reduce((sum, r) => sum + r.opsPerSec, 0) / results.length;
const fastestOps = Math.max(...results.map((r) => r.opsPerSec));
const slowestOps = Math.min(...results.map((r) => r.opsPerSec));

console.log("Statistics:");
console.log(`  Average ops/sec: ${avgOpsPerSec.toFixed(0)}`);
console.log(`  Fastest: ${fastestOps.toFixed(0)} ops/sec`);
console.log(`  Slowest: ${slowestOps.toFixed(0)} ops/sec`);
console.log(`  Total benchmarks: ${results.length}`);
console.log("\n" + "=".repeat(70));
