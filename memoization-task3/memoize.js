function createKey(args) {
    return JSON.stringify(args);
}

function memoize(fn, options = {}) {
    const {
        maxSize = Infinity,
        policy = "LRU",
        ttl = null,
        customEvict = null
    } = options;

    const cache = new Map();

    function removeExpiredItems() {
        if (ttl === null) return;

        const now = Date.now();

        for (const [key, item] of cache.entries()) {
            if (now - item.createdAt > ttl) {
                cache.delete(key);
            }
        }
    }

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
        } else if (policy === "CUSTOM" && typeof customEvict === "function") {
            keyToDelete = customEvict(cache);
        } else {
            keyToDelete = cache.keys().next().value;
        }

        if (keyToDelete !== undefined) {
            cache.delete(keyToDelete);
        }
    }

    return function (...args) {
        removeExpiredItems();

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
            createdAt: now,
            lastUsed: now,
            usageCount: 1
        });

        evictIfNeeded();

        console.log("Обчислено заново:", args);
        return result;
    };
}

module.exports = memoize;
