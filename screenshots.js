// https://github.com/pmdartus/snapline/blob/master/index.js

const fs = require('fs');
const path = require('path');
const timelineFile = fs.readFileSync('./data/profiles/cf-trace.raw.json');
const config = {
    dataPath: './data/profiles/screenshots'
};

let timelineEntries;
try {
    timelineEntries = JSON.parse(timelineFile);
} catch (e) {
    console.error(`Impossible to parse: ${timelineFile}`);
    process.exit(1);
}

if (!fs.existsSync(config.dataPath)) {
    fs.mkdirSync(config.dataPath);
}

let screenshots = timelineEntries.filter((entry) => entry.name === 'Screenshot');
console.log(screenshots);
screenshots.map((entry, index) => {
    const fileName = `screenshot-${index}.png`;
    const filePath = path.resolve(config.dataPath, fileName);
    const fileContent = entry.args.snapshot;

    return fs.writeFileSync(filePath, fileContent, 'base64');
});
