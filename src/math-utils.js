export class MathUtils {
    // x and y are relative to the rotation origin.
    // Should equal to Math.atan2(y,x)
    static calcRotationAngle(x, y) {
        if (x == 0) {
            return y > 0 ? 90 : (y < 0 ? 270 : 0);
        }
        if (y == 0) {
            return x > 0 ? 0 : (x < 0 ? 180 : 0);
        }

        let alphaR = 0; // the angle in radians
        if (x > 0 && y > 0) {
            alphaR = Math.atan(y / x);
        }
        if (x < 0 && y > 0) {
            alphaR = Math.PI / 2 + Math.atan(Math.abs(x) / y);
        }
        if (x < 0 && y < 0) {
            alphaR = Math.PI + Math.atan(y / x);
        }
        if (x > 0 && y < 0) {
            alphaR = Math.PI + Math.PI / 2 + Math.atan(x / Math.abs(y));
        }
        return alphaR * 180 / Math.PI;
    }

    // distance between two points
    static twoPointsDistance(x1, y1, x2, y2) {
        return Math.sqrt(
            Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)
        );
    }

    static pointToAngleAndLength(x, y) {
        return {
            angle: MathUtils.calcRotationAngle(x, y),
            length: MathUtils.twoPointsDistance(0, 0, x, y)
        };
    }

    static angleAndLengthToPoint(angle, length) {
        const angleRadians = angle / 180 * Math.PI;
        return {
            x: length * Math.cos(angleRadians),
            y: length * Math.sin(angleRadians)
        };
    }

    static isNumber(n) {
        return typeof n === 'number';
    }
}
