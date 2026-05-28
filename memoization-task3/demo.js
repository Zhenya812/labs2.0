const memoize = require("./memoize");

function multiply(a, b) {
    console.log("Функція виконується:");
    return a * b;
}

console.log(" Базова мемоізація");

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


console.log("\n Обмеження за часом");

const ttlMemoized = memoize(multiply, {
    ttl: 2000
});

console.log(ttlMemoized(5, 5));
console.log(ttlMemoized(5, 5));

setTimeout(() => {
    console.log(ttlMemoized(5, 5));
}, 3000);


console.log("\n Власна політика видалення");

const customMemoized = memoize(multiply, {
    maxSize: 2,
    policy: "CUSTOM",
    customEvict: (cache) => {
        return cache.keys().next().value;
    }
});

console.log(customMemoized(6, 6));
console.log(customMemoized(7, 7));
console.log(customMemoized(8, 8));
