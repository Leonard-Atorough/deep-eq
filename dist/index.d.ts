/**
 * Deep equality comparison for any two values
 * Supports: primitives, objects, arrays, Date, RegExp, Map, Set
 * Handles circular references with WeakMap-based cycle detection
 */
declare function deepEqual<T>(objA: T, objB: T, visited?: WeakMap<object, object>): boolean;
export default deepEqual;
