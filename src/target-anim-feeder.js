import { MathUtils } from './math-utils';

export class TargetAnimFeeder {
    constructor() {
        this._prevPoint = null;
        this._pointQueue = [];
        this._speed = 200; // px per second -- travel speed
    }

    addPoint(point) {
        this._pointQueue.push(point);
    }

    setSpeed(speed) {
        if (speed < 0) {
            throw new Error('Length change speed cannot be negative.');
        }
        this._speed = speed;
    }

    getSpeed() {
        return this._speed;
    }

    getNextAngleAndLength(deltaT) {
        if (this._pointQueue.length === 0) {
            return this._prevPoint
                ? this._pointToAngleAndLength(this._prevPoint)
                : {angle: 0, length: 0};
        }

        if (!this._prevPoint) {
            this._prevPoint = this._pointQueue.shift();
            return this._pointToAngleAndLength(this._prevPoint);
        }

        let accumDist = 0;
        const targetDist = this._speed * deltaT / 1000;

        while (this._pointQueue.length > 0 && accumDist < targetDist) {
            const nextPoint = this._pointQueue.shift();

            const travelDist = MathUtils.twoPointsDistance(
                this._prevPoint.relX, this._prevPoint.relY, nextPoint.relX, nextPoint.relY);
            if (accumDist + travelDist > targetDist) {
                this._pointQueue.unshift(nextPoint);
                const desirableDist = targetDist - accumDist;
                const midPoint = {
                    relX: this._prevPoint.relX + (desirableDist / travelDist) * (nextPoint.relX - this._prevPoint.relX),
                    relY: this._prevPoint.relY + (desirableDist / travelDist) * (nextPoint.relY - this._prevPoint.relY)
                };
                this._prevPoint = midPoint;
                accumDist = targetDist;
            } else {
                accumDist += travelDist;
                this._prevPoint = nextPoint;
            }
        }

        return this._pointToAngleAndLength(this._prevPoint);
    }

    _pointToAngleAndLength(point) {
        return {
            angle: MathUtils.calcRotationAngle(point.relX, point.relY),
            length: MathUtils.twoPointsDistance(0, 0, point.relX, point.relY)
        };
    }
}
