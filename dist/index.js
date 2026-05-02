/**
 * Deep equality comparison for any two values
 * Supports: primitives, objects, arrays, Date, RegExp, Map, Set
 * Handles circular references with WeakMap-based cycle detection
 */
function deepEqual(objA, objB, visited) {
    if (objA === objB)
        return true;
    const typeA = typeof objA;
    const typeB = typeof objB;
    if (typeA !== typeB)
        return false;
    if (typeA === "number" && isNaN(objA)) {
        return isNaN(objB);
    }
    if (typeA !== "object")
        return false;
    if (objA === null || objB === null)
        return false;
    if (!visited)
        visited = new WeakMap();
    if (visited.has(objA) && visited.get(objA) === objB)
        return true;
    visited.set(objA, objB);
    if (Array.isArray(objA)) {
        return Array.isArray(objB) && compareArrays(objA, objB, visited);
    }
    if (Array.isArray(objB))
        return false;
    if (objA instanceof Date && objB instanceof Date) {
        return objA.getTime() === objB.getTime();
    }
    if (objA?.constructor === RegExp && objB?.constructor === RegExp) {
        return (objA.source === objB.source &&
            objA.flags === objB.flags);
    }
    if (objA instanceof Map && objB instanceof Map) {
        return compareMaps(objA, objB, visited);
    }
    if (objA instanceof Set && objB instanceof Set) {
        return compareSets(objA, objB, visited);
    }
    if (ArrayBuffer.isView(objA) && ArrayBuffer.isView(objB)) {
        return compareTypedArrays(objA, objB, visited);
    }
    return compareObjects(objA, objB, visited);
}
function compareArrays(arrA, arrB, visited) {
    if (arrA.length !== arrB.length)
        return false;
    for (let i = 0; i < arrA.length; i++) {
        if (!deepEqual(arrA[i], arrB[i], visited))
            return false;
    }
    return true;
}
function compareMaps(mapA, mapB, visited) {
    if (mapA.size !== mapB.size)
        return false;
    for (const [key, value] of mapA) {
        if (!mapB.has(key) || !deepEqual(value, mapB.get(key), visited))
            return false;
    }
    return true;
}
function compareSets(setA, setB, visited) {
    if (setA.size !== setB.size)
        return false;
    for (const value of setA) {
        let found = false;
        for (const otherValue of setB) {
            if (deepEqual(value, otherValue, visited)) {
                found = true;
                break;
            }
        }
        if (!found)
            return false;
    }
    return true;
}
function compareTypedArrays(typedA, typedB, visited) {
    if (typedA.constructor !== typedB.constructor)
        return false;
    if (typedA instanceof DataView) {
        if (typedA.byteLength !== typedB.byteLength)
            return false;
        for (let i = 0; i < typedA.byteLength; i++) {
            if (typedA.getUint8(i) !== typedB.getUint8(i))
                return false;
        }
        return true;
    }
    if (!isTypedArray(typedA) || !isTypedArray(typedB))
        return false;
    if (typedA.length !== typedB.length)
        return false;
    for (let i = 0; i < typedA.length; i++) {
        if (typedA[i] !== typedB[i])
            return false;
    }
    return true;
}
function isTypedArray(val) {
    return !(val instanceof DataView);
}
function compareObjects(objA, objB, visited) {
    if (objA.constructor !== objB.constructor)
        return false;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (!keysB.includes(key))
            return false;
        if (!deepEqual(objA[key], objB[key], visited))
            return false;
    }
    return true;
}
export default deepEqual;
