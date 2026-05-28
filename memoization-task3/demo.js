const memoize = require("./memoize");

function multiply(a, b) {
    console.log("Функція виконується:");
    return a * b;
}

console.log("Базова мемоізація");

const memoizedMultiply = memoize(multiply);

console.log(memoizedMultiply(2, 3));
console.log(memoizedMultiply(2, 3));
console.log(memoizedMultiply(4, 5));
console.log(memoizedMultiply(4, 5));
