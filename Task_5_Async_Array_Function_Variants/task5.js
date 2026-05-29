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