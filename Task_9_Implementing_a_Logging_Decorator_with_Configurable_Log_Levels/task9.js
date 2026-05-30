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