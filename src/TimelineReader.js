var fs = require('fs');
var traceToTimelineModel = require('devtools-timeline-model');

class TimelineReader {
    constructor() {
        
    }
    
    read(data) {
        return traceToTimelineModel(data);
    }

    static fromFile(fileName) {
        let timeLineReader = new TimelineReader();
        let data = fs.readFileSync(fileName, 'utf8');
        
        return timeLineReader.read(data);
    }
}

module.exports = TimelineReader;
