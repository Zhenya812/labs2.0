function* incrementalCounter(start = 1) {
    let current = start;

    while (true) {
        yield current;
        current++;
    }
}
function consumeWithTimeout(iterator, timeoutSeconds) {
    const startTime = Date.now();

    let total = 0;
    let count = 0;

    const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;

        if (elapsedTime >= timeoutSeconds) {
            clearInterval(interval);
            console.log("Час виконання завершено.");
            return;
        }

        const value = iterator.next().value;

        total += value;
        count++;

        const average = total / count;

        console.log(
            `Значення:: ${value}, Сума: ${total}, Середнє: ${average.toFixed(2)}`
        );

    }, 500);
}
const counter = incrementalCounter(1);

consumeWithTimeout(counter, 5);
