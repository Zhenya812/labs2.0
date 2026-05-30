const fs = require("fs");
const readline = require("readline");

async function processLargeFile(filePath) {
    const fileStream = fs.createReadStream(filePath, {
        encoding: "utf8"
    });

    const lineReader = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;
    let wordCount = 0;
    let characterCount = 0;

    for await (const line of lineReader) {
        lineCount++;

        const words = line
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0);

        wordCount += words.length;
        characterCount += line.length;

        console.log(`Оброблено рядок ${lineCount}: ${line}`);
    }

    console.log("Результат обробки файлу");
    console.log("Кількість рядків:", lineCount);
    console.log("Кількість слів:", wordCount);
    console.log("Кількість символів:", characterCount);
}
