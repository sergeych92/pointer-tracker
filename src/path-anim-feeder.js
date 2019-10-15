import { MathUtils } from './math-utils';

export class PathAnimFeeder {
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
    }

    getNextAngleAndLength(deltaT) {
        if (this._pointQueue.length === 0) {
            return this._prevPoint
                ? this._pointToAngleAndLength(this._prevPoint)
                : this._pointToAngleAndLength({x: 0, y: 0});
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
                this._prevPoint.x, this._prevPoint.y, nextPoint.x, nextPoint.y);
            if (accumDist + travelDist > targetDist) {
                this._pointQueue.unshift(nextPoint);
                const desirableDist = targetDist - accumDist;
                const midPoint = {
                    x: this._prevPoint.x + (desirableDist / travelDist) * (nextPoint.x - this._prevPoint.x),
                    y: this._prevPoint.y + (desirableDist / travelDist) * (nextPoint.y - this._prevPoint.y)
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
            ...MathUtils.pointToAngleAndLength(point.x, point.y),
            point: point
        };
    }
}
