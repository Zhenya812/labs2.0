function* incrementalCounter(start = 1) {
    let current = start;

    while (true) {
        yield current;
        current++;
    }
}