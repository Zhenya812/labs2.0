const memoize = require("./memoize");

function multiply(a, b) {
    console.log("Функція виконується:");
    return a * b;
}

console.log("Базова мемоізація");

const memoizedMultiply = memoize(multiply);

console.log(memoizedMultiply(2, 3));
console.log(memoizedMultiply(2, 3));


console.log("\n Політика LRU");

const lruMemoized = memoize(multiply, {
    maxSize: 2,
    policy: "LRU"
});

console.log(lruMemoized(1, 2));
console.log(lruMemoized(3, 4));
console.log(lruMemoized(1, 2));
console.log(lruMemoized(5, 6));


console.log("\n Політика LFU");

const lfuMemoized = memoize(multiply, {
    maxSize: 2,
    policy: "LFU"
});

console.log(lfuMemoized(2, 2));
console.log(lfuMemoized(2, 2));
console.log(lfuMemoized(3, 3));
console.log(lfuMemoized(4, 4));
