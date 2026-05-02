import type { TypedArray } from "./utils.ts";

/**
 * Deep equality comparison for any two values
 * Supports: primitives, objects, arrays, Date, RegExp, Map, Set
 * Handles circular references with WeakMap-based cycle detection
 */
function deepEqual<T>(objA: T, objB: T, visited?: WeakMap<object, object>): boolean {
  if (objA === objB) return true;

  const typeA = typeof objA;
  const typeB = typeof objB;

  if (typeA !== typeB) return false;

  if (typeA === "number" && isNaN(objA as any)) {
    return isNaN(objB as any);
  }

  if (typeA !== "object") return false;

  if (objA === null || objB === null) return false;

  if (!visited) visited = new WeakMap();
  if (visited.has(objA as object) && visited.get(objA as object) === objB) return true;
  visited.set(objA as object, objB as object);

  if (Array.isArray(objA)) {
    return Array.isArray(objB) && compareArrays(objA, objB, visited);
  }
  if (Array.isArray(objB)) return false;

  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime();
  }

  if (objA?.constructor === RegExp && objB?.constructor === RegExp) {
    return (
      (objA as RegExp).source === (objB as RegExp).source &&
      (objA as RegExp).flags === (objB as RegExp).flags
    );
  }

  if (objA instanceof Map && objB instanceof Map) {
    return compareMaps(objA, objB, visited);
  }

  if (objA instanceof Set && objB instanceof Set) {
    return compareSets(objA, objB, visited);
  }

  if (ArrayBuffer.isView(objA) && ArrayBuffer.isView(objB)) {
    return compareTypedArrays(objA, objB);
  }

  return compareObjects(objA as any, objB as any, visited);
}

function compareArrays(
  arrA: unknown[],
  arrB: unknown[],
  visited: WeakMap<object, object>,
): boolean {
  if (arrA.length !== arrB.length) return false;
  for (let i = 0; i < arrA.length; i++) {
    if (!deepEqual(arrA[i], arrB[i], visited)) return false;
  }
  return true;
}

function compareMaps(
  mapA: Map<unknown, unknown>,
  mapB: Map<unknown, unknown>,
  visited: WeakMap<object, object>,
): boolean {
  if (mapA.size !== mapB.size) return false;
  for (const [key, value] of mapA) {
    if (!mapB.has(key) || !deepEqual(value, mapB.get(key), visited)) return false;
  }
  return true;
}

function compareSets(
  setA: Set<unknown>,
  setB: Set<unknown>,
  visited: WeakMap<object, object>,
): boolean {
  if (setA.size !== setB.size) return false;
  for (const value of setA) {
    let found = false;
    for (const otherValue of setB) {
      if (deepEqual(value, otherValue, visited)) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}

function compareTypedArrays(
  typedA: ArrayBufferView,
  typedB: ArrayBufferView,
): boolean {
  if (typedA.constructor !== typedB.constructor) return false;

  if (typedA instanceof DataView) {
    if (typedA.byteLength !== typedB.byteLength) return false;

    for (let i = 0; i < typedA.byteLength; i++) {
      if (typedA.getUint8(i) !== (typedB as DataView<ArrayBufferLike>).getUint8(i)) return false;
    }
    return true;
  }

  if (!isTypedArray(typedA) || !isTypedArray(typedB)) return false;

  if (typedA.length !== typedB.length) return false;

  for (let i = 0; i < typedA.length; i++) {
    if (typedA[i] !== typedB[i]) return false;
  }
  return true;
}

function isTypedArray(val: ArrayBufferView): val is TypedArray {
  return !(val instanceof DataView);
}

function compareObjects(
  objA: Record<string, unknown>,
  objB: Record<string, unknown>,
  visited: WeakMap<object, object>,
): boolean {
  if (objA.constructor !== objB.constructor) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key], visited)) return false;
  }

  return true;
}

export default deepEqual;
