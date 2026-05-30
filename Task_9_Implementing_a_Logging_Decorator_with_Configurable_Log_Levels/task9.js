const fs = require("fs");

const LogLevel = {
    INFO: "INFO",
    DEBUG: "DEBUG",
    ERROR: "ERROR"
};

function defaultFormatter(logData) {
    return `[${logData.timestamp}] [${logData.level}] ${logData.functionName} | Args: ${JSON.stringify(logData.args)} | Result: ${JSON.stringify(logData.result)} | Time: ${logData.executionTime}ms`;
}

function jsonFormatter(logData) {
    return JSON.stringify(logData);
}

function writeLog(message, output = "console") {
    if (output === "console") {
        console.log(message);
    }

    if (output === "file") {
        fs.appendFileSync("logs.txt", message + "\n", "utf8");
    }

    if (output === "external") {
        console.log("Відправлено у зовнішній сервіс:", message);
    }
}

function log(level = LogLevel.INFO, options = {}) {
    const {
        output = "console",
        formatter = defaultFormatter,
        onlyErrors = false
    } = options;

    return function (fn) {
        return function (...args) {
            const functionName = fn.name || "anonymousFunction";
            const startTime = Date.now();

            try {
                const result = fn(...args);

                if (result instanceof Promise) {
                    return result
                        .then((value) => {
                            const executionTime = Date.now() - startTime;

                            if (!onlyErrors && level !== LogLevel.ERROR) {
                                const logData = {
                                    timestamp: new Date().toISOString(),
                                    level: level,
                                    functionName: functionName,
                                    args: args,
                                    result: value,
                                    executionTime: executionTime
                                };

                                writeLog(formatter(logData), output);
                            }

                            return value;
                        })
                        .catch((error) => {
                            const executionTime = Date.now() - startTime;

                            const logData = {
                                timestamp: new Date().toISOString(),
                                level: LogLevel.ERROR,
                                functionName: functionName,
                                args: args,
                                error: error.message,
                                executionTime: executionTime
                            };

                            writeLog(formatter(logData), output);

                            throw error;
                        });
                }

                const executionTime = Date.now() - startTime;

                if (!onlyErrors && level !== LogLevel.ERROR) {
                    const logData = {
                        timestamp: new Date().toISOString(),
                        level: level,
                        functionName: functionName,
                        args: args,
                        result: result,
                        executionTime: executionTime
                    };

                    writeLog(formatter(logData), output);
                }

                return result;

            } catch (error) {
                const executionTime = Date.now() - startTime;

                const logData = {
                    timestamp: new Date().toISOString(),
                    level: LogLevel.ERROR,
                    functionName: functionName,
                    args: args,
                    error: error.message,
                    executionTime: executionTime
                };

                writeLog(formatter(logData), output);

                throw error;
            }
        };
    };
}
