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

function add(a, b) {
    return a + b;
}

const loggedAdd = log(LogLevel.INFO)(add);

console.log("Результат додавання:", loggedAdd(5, 3));

function divide(a, b) {
    if (b === 0) {
        throw new Error("Ділення на нуль неможливе");
    }

    return a / b;
}

const loggedDivide = log(LogLevel.ERROR)(divide);

try {
    console.log("Результат ділення:", loggedDivide(10, 0));
} catch (error) {
    console.log("Помилка оброблена:", error.message);
}

async function fetchUser(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                name: "Акакій"
            });
        }, 500);
    });
}

const loggedFetchUser = log(LogLevel.DEBUG)(fetchUser);

loggedFetchUser(1).then((user) => {
    console.log("Отриманий користувач:", user);
});

function multiply(a, b) {
    return a * b;
}

const loggedMultiply = log(LogLevel.INFO, {
    output: "file"
})(multiply);

console.log("Результат множення:", loggedMultiply(4, 6));

function subtract(a, b) {
    return a - b;
}

const loggedSubtract = log(LogLevel.INFO, {
    formatter: jsonFormatter
})(subtract);

console.log("Результат віднімання:", loggedSubtract(10, 4));

function checkAge(age) {
    if (age < 18) {
        throw new Error("Користувач занадто молодий");
    }

    return "Доступ дозволено";
}

const loggedCheckAge = log(LogLevel.INFO, {
    onlyErrors: true
})(checkAge);

try {
    console.log(loggedCheckAge(16));
} catch (error) {
    console.log("Помилка доступу:", error.message);
}
