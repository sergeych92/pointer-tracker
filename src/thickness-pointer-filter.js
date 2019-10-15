import { MathUtils } from './math-utils';

export class PointerThicknessFilter {
    constructor({
        viewportDim: {width, height},
        pointerMax: {minWidth, maxWidth, minHeight, maxHeight},
        pointerDim
    }) {
        this._prevPoint = null;
        this._nextPoint = null;

        this._pointerBoundaries = {minWidth, maxWidth, minHeight, maxHeight};

        this._maxDistance = MathUtils.twoPointsDistance(0, 0, width, height);

        this._defaultDim = pointerDim;
    }

    setPrevPoint(point) {
        this._prevPoint = point;
    }

    setNextPoint(point) {
        this._nextPoint = point;
    }

    getPointerThickness() {
        if (!this._prevPoint || !this._nextPoint) {
            return this._defaultDim;
        }

        const pointsDistance = MathUtils.twoPointsDistance(
            this._prevPoint.x, this._prevPoint.y, this._nextPoint.x, this._nextPoint.y);

        const shrinkRatio = this._thicknessProgressFunc(pointsDistance / this._maxDistance);

        return {
            width: this._pointerBoundaries.minWidth
                + (this._pointerBoundaries.maxWidth - this._pointerBoundaries.minWidth) * shrinkRatio,
            height: this._pointerBoundaries.minHeight
                + (this._pointerBoundaries.maxHeight - this._pointerBoundaries.minHeight) * shrinkRatio
        };
    }

    // x is supposed to be from 1 to 0 inclusive
    _thicknessProgressFunc(x) {
        return 1 - Math.pow((x - 1), 4);
    }
}
