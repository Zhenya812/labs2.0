const {
    incrementalCounter,
    consumeWithTimeout
} = require("labs2.0");

const counter = incrementalCounter(1);

consumeWithTimeout(counter, 5);