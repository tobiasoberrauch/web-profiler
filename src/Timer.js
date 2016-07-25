class Timer {
    constructor() {
        this.count = this.sum = 0;
        this.max = this.min = null;

    }

    add(val) {
        if (typeof val === 'number') {
            this.count++;
            this.sum += val;
            if (this.max === null || val > this.max) {
                this.max = val;
            }
            if (this.min === null || val < this.min) {
                this.min = val;
            }
        }
    }

    getStats() {
        return {
            mean: this.count === 0 ? 0 : this.sum / this.count,
            max: this.max,
            min: this.min,
            sum: this.sum,
            count: this.count
        }
    }
}

module.exports = Timer;