const fs = require('fs');
const path = require('path');

class ScreenshotService {
    constructor(config) {
        this.config = config;

        if (!fs.existsSync(config.dataPath)) {
            fs.mkdirSync(config.dataPath);
        }
    }

    fromTimelineFile(filePath) {
        let timeline = fs.readFileSync(filePath);
        this.fromTimeline(timeline);
    }

    fromTimeline(timeline) {
        let timelineEntries = JSON.parse(timeline);
        let screenshots = timelineEntries.filter((entry) => entry.name === 'Screenshot');

        screenshots.forEach((entry, index) => {
            const fileName = `screenshot-${index}.png`;
            const filePath = path.resolve(this.config.dataPath, fileName);
            const fileContent = entry.args.snapshot;

            fs.writeFileSync(filePath, fileContent, 'base64');
        });
    }
}

module.exports = ScreenshotService;