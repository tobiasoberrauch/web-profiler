// https://github.com/pmdartus/snapline/blob/master/index.js
const psi = require('psi');
const fs = require('fs');
const path = require('path');
const atatus = require("atatus-node");
const config = {
    dataPath: './data/profiles/screenshots'
};


atatus.start({
    apiKey: "9bc43f856f2647fbafa2cd333525abc1"
});




//let timelineEntries;
//try {
//    timelineEntries = JSON.parse(timelineFile);
//} catch (e) {
//    console.error(`Impossible to parse: ${timelineFile}`);
//    process.exit(1);
//}
//
//if (!fs.existsSync(config.dataPath)) {
//    fs.mkdirSync(config.dataPath);
//}
//
//let screenshots = timelineEntries.filter((entry) => entry.name === 'Screenshot');
//console.log(screenshots);
//screenshots.map((entry, index) => {
//    const fileName = `screenshot-${index}.png`;
//    const filePath = path.resolve(config.dataPath, fileName);
//    const fileContent = entry.args.snapshot;
//
//    return fs.writeFileSync(filePath, fileContent, 'base64');
//});
