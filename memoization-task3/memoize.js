function createKey(args) {
    return JSON.stringify(args);
}

function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = createKey(args);

        if (cache.has(key)) {
            console.log("Взято з кешу:", args);
            return cache.get(key);
        }

        const result = fn(...args);

        cache.set(key, result);

        console.log("Обчислено заново:", args);
        return result;
    };
}

module.exports = memoize;