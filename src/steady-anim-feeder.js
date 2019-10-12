import { MathUtils } from './math-utils';

export class SteadyAnimFeeder {
    constructor() {
        this._prevAngle = null;
        this._prevLength = null;
        this._anglesQueue = [];
        this._lengthsQueue = [];
        this._rotationSpeed = 180; // degrees per second
        this._lengthChangeSpeed = 200; // px per second -- length change speed
    }

    addPoint(point) {
        const angle = MathUtils.calcRotationAngle(point.relX, point.relY);
        this._anglesQueue.push(angle);

        const length = MathUtils.twoPointsDistance(0, 0, point.relX, point.relY);
        this._lengthsQueue.push(length);
    }

    setRotationSpeed(speed) {
        if (speed < 0 || speed > 359) {
            throw new Error('Rotation speed must be in range [1;359].');
        }
        this._rotationSpeed = speed;
    }

    getRotationSpeed() {
        return this._rotationSpeed;
    }

    setLengthChangeSpeed(speed) {
        if (speed < 0) {
            throw new Error('Length change speed cannot be negative.');
        }
        this._lengthChangeSpeed = speed;
    }

    getLengthChangeSpeed() {
        return this._lengthChangeSpeed;
    }

    getNextAngle(deltaT) {
        if (this._anglesQueue.length === 0) {
            return this._prevAngle || 0;
        }

        if (!this._prevAngle) {
            this._prevAngle = this._anglesQueue.shift();
            return this._prevAngle;
        }

        let accumRotDist = 0;
        const targetRotDist = this._rotationSpeed * deltaT / 1000;

        while (this._anglesQueue.length > 0 && accumRotDist < targetRotDist) {
            const nextAngle = this._anglesQueue.shift();
            
            // from I to IV quadrant
            if (this._prevAngle < 90 && nextAngle > 270) {
                this._prevAngle += 360;
            }

            // from IV to I quadrant
            if (nextAngle < 90 && this._prevAngle > 270) {
                this._prevAngle -= 360;
            }

            const angleDiffRaw = nextAngle - this._prevAngle;
            const angleDiff = Math.abs(angleDiffRaw);
            if (accumRotDist + angleDiff > targetRotDist) {
                this._anglesQueue.unshift(nextAngle);
                const desirableRotDist = targetRotDist - accumRotDist;
                const midAngle = this._prevAngle + desirableRotDist * (angleDiffRaw >= 0 ? 1 : -1);
                this._prevAngle = midAngle;
                accumRotDist = targetRotDist;
            } else {
                accumRotDist += angleDiff;
                this._prevAngle = nextAngle;
            }
        }

        return this._prevAngle;
    }

    getNextLength(deltaT) {
        if (this._lengthsQueue.length === 0) {
            return this._prevLength || 0;
        }

        if (!this._prevLength) {
            this._prevLength = this._lengthsQueue.shift();
            return this._prevLength;
        }

        let accumDist = 0;
        const targetDist = this._lengthChangeSpeed * deltaT / 1000;

        while (this._lengthsQueue.length > 0 && accumDist < targetDist) {
            const nextLength = this._lengthsQueue.shift();

            const lengthDiffRaw = nextLength - this._prevLength;
            const lengthDiff = Math.abs(lengthDiffRaw);
            if (accumDist + lengthDiff > targetDist) {
                this._lengthsQueue.unshift(nextLength);
                const desirableDist = targetDist - accumDist;
                const midLength = this._prevLength + desirableDist * (lengthDiffRaw >= 0 ? 1 : -1);
                this._prevLength = midLength;
                accumDist = targetDist;
            } else {
                accumDist += lengthDiff;
                this._prevLength = nextLength;
            }
        }

        return this._prevLength;
    }
}
