import { MathUtils } from './math-utils';

export class TargetAnimFeeder {
    constructor() {
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

    getPosition() {
        if (!this._prevPoint) {
            throw new Error('Position has not been set yet.');
        }
        return this._prevPoint;
    }

    setPosition({x, y}) {
        if (!MathUtils.isNumber(x) || !MathUtils.isNumber(y)) {
            throw new Error('Position must be provided in two coordinates.');
        }
        this._prevPoint = {x, y};
        this._nextPoint = {x,y};
    }

    getNextAngleAndLength(deltaT) {
        if (this._prevPoint && this._nextPoint) {
            const targetDist = this._speed * deltaT / 1000;
            const actualDist = MathUtils.twoPointsDistance(
                this._prevPoint.x, this._prevPoint.y, this._nextPoint.x, this._nextPoint.y);
    
            if (actualDist > targetDist) {
                const midPoint = {
                    x: this._prevPoint.x + (targetDist / actualDist) * (this._nextPoint.x - this._prevPoint.x),
                    y: this._prevPoint.y + (targetDist / actualDist) * (this._nextPoint.y - this._prevPoint.y)
                };
                this._prevPoint = midPoint;
            } else {
                this._prevPoint = this._nextPoint;
            }
        }

        if (this._prevPoint) {
            return this._pointToAngleAndLength(this._prevPoint);
        } else {
            return this._pointToAngleAndLength({x: 0, y: 0});
        }
    }

    _pointToAngleAndLength(point) {
        return {
            ...MathUtils.pointToAngleAndLength(point.x, point.y),
            point: point
        };
    }
}
