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
