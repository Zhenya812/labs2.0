function createKey(args) {
    return JSON.stringify(args);
}

function memoize(fn, options = {}) {
    const {
        maxSize = Infinity,
        policy = "LRU"
    } = options;

    const cache = new Map();

    function evictIfNeeded() {
        if (cache.size <= maxSize) return;

        let keyToDelete;

        if (policy === "LRU") {
            let oldestAccessTime = Infinity;

            for (const [key, item] of cache.entries()) {
                if (item.lastUsed < oldestAccessTime) {
                    oldestAccessTime = item.lastUsed;
                    keyToDelete = key;
                }
            }
        } else if (policy === "LFU") {
            let smallestUsageCount = Infinity;

            for (const [key, item] of cache.entries()) {
                if (item.usageCount < smallestUsageCount) {
                    smallestUsageCount = item.usageCount;
                    keyToDelete = key;
                }
            }
        } else {
            keyToDelete = cache.keys().next().value;
        }

        if (keyToDelete !== undefined) {
            cache.delete(keyToDelete);
        }
    }

    return function (...args) {
        const key = createKey(args);
        const now = Date.now();

        if (cache.has(key)) {
            const item = cache.get(key);

            item.lastUsed = now;
            item.usageCount++;

            console.log("Взято з кешу:", args);
            return item.value;
        }

        const result = fn(...args);

        cache.set(key, {
            value: result,
            lastUsed: now,
            usageCount: 1
        });

        evictIfNeeded();

        console.log("Обчислено заново:", args);
        return result;
    };
}

module.exports = memoize;
