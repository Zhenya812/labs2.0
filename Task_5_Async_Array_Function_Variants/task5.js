function asyncMapCallback(array, asyncCallback, finalCallback, signal) {
    const result = [];
    let completed = 0;

    if (array.length === 0) {
        finalCallback(null, result);
        return;
    }

    for (let i = 0; i < array.length; i++) {
        if (signal && signal.aborted) {
            finalCallback(new Error("Операцію скасовано"));
            return;
        }

        asyncCallback(array[i], i, (error, mappedValue) => {
            if (signal && signal.aborted) {
                finalCallback(new Error("Операцію скасовано"));
                return;
            }

            if (error) {
                finalCallback(error);
                return;
            }

            result[i] = mappedValue;
            completed++;

            if (completed === array.length) {
                finalCallback(null, result);
            }
        });
    }
}

function asyncMapPromise(array, asyncCallback, signal) {
    return new Promise((resolve, reject) => {
        if (signal && signal.aborted) {
            reject(new Error("Операцію скасовано"));
            return;
        }

        const promises = array.map((item, index) => {
            return new Promise((resolveItem, rejectItem) => {
                if (signal && signal.aborted) {
                    rejectItem(new Error("Операцію скасовано"));
                    return;
                }

                asyncCallback(item, index, signal)
                    .then(resolveItem)
                    .catch(rejectItem);
            });
        });

        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });
}

console.log("Callback-based async map");

const numbers1 = [1, 2, 3, 4];

asyncMapCallback(
    numbers1,
    (number, index, callback) => {
        setTimeout(() => {
            callback(null, number * 2);
        }, 500);
    },
    (error, result) => {
        if (error) {
            console.log("Помилка:", error.message);
            return;
        }

        console.log("Результат callback-версії:", result);
    }
);

console.log("Promise-based async map");

const numbers2 = [5, 6, 7, 8];

asyncMapPromise(numbers2, (number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(number * 3);
        }, 500);
    });
})
    .then((result) => {
        console.log("Результат Promise-версії:", result);
    })
    .catch((error) => {
        console.log("Помилка:", error.message);
    });

async function runAsyncAwaitExample() {
    console.log("Async/Await example");

    try {
        const numbers3 = [10, 20, 30];

        const result = await asyncMapPromise(numbers3, async (number) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(number + 100);
                }, 500);
            });
        });

        console.log("Результат async/await:", result);
    } catch (error) {
        console.log("Помилка:", error.message);
    }
}

runAsyncAwaitExample();

async function runAbortExample() {
    console.log("AbortController example");

    const controller = new AbortController();
    const signal = controller.signal;

    setTimeout(() => {
        controller.abort();
    }, 700);

    try {
        const numbers4 = [1, 2, 3, 4, 5];

        const result = await asyncMapPromise(
            numbers4,
            (number, index, signal) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (signal && signal.aborted) {
                            reject(new Error("Операцію скасовано"));
                            return;
                        }

                        resolve(number * 10);
                    }, 1000);
                });
            },
            signal
        );

        console.log("Результат після скасування:", result);
    } catch (error) {
        console.log("Помилка:", error.message);
    }
}

runAbortExample();
