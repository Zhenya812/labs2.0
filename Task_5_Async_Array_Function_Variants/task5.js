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
