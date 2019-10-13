import { MathUtils } from './math-utils';

export class TargetAnimFeeder {
    constructor() {
        this._prevPoint = null;
        this._nextPoint = null;
        this._speed = 200; // px per second -- travel speed
    }

    addPoint(point) {
        if (!this._prevPoint) {
            this._prevPoint = point;
        }
        this._nextPoint = point;
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
        if (!this._prevPoint) {
            return {angle: 0, length: 0};
        }

        if (this._prevPoint === this._nextPoint) {
            return this._pointToAngleAndLength(this._prevPoint);
        }

        const targetDist = this._speed * deltaT / 1000;
        const actualDist = MathUtils.twoPointsDistance(
            this._prevPoint.relX, this._prevPoint.relY, this._nextPoint.relX, this._nextPoint.relY);

        if (actualDist > targetDist) {
            const midPoint = {
                relX: this._prevPoint.relX + (targetDist / actualDist) * (this._nextPoint.relX - this._prevPoint.relX),
                relY: this._prevPoint.relY + (targetDist / actualDist) * (this._nextPoint.relY - this._prevPoint.relY)
            };
            this._prevPoint = midPoint;
        } else {
            this._prevPoint = this._nextPoint;
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
