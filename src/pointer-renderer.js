export class PointerRenderer {
    constructor(circleEl, pointerEl) {
        this._circleEl = circleEl;
        this._pointerEl = pointerEl;

        this._lineEl = this._pointerEl.firstElementChild;
        this._triangleEl = this._pointerEl.lastElementChild;
        
        this._circleRadius = 20;
        this._lineY = 20;

        this._triangleBoundaries = {
            minWidth: 7,
            maxWidth: 15,
            minHeight: 10,
            maxHeight: 20
        };

        this._triangleWidth = this._triangleBoundaries.maxWidth;
        this._triangleHeight = this._triangleBoundaries.maxHeight;
        this._pointerLength = 100;
        this._angle = 0;
    }

    getCircleRadius() {
        return this._circleRadius;
    }

    getTriangleBoundaries() {
        return this._triangleBoundaries;
    }

    getTriangleDim() {
        return {width: this._triangleWidth, height: this._triangleHeight};
    }

    // x and y are relative to the rotation origin
    rotate(angle) {
        this._angle = angle;
    }

    // set the length of the pointers
    setLength(length) {
        if (length < 0) {
            throw new Error('Pointer length must be a non-negative number.');
        }
        this._pointerLength = length;
    }

    setTriangleWidth(width) {
        if (width < this._triangleBoundaries.minWidth || width > this._triangleBoundaries.maxWidth) {
            throw new Error('Triangle width must be within the allowed range.');
        }
        this._triangleWidth = width;
    }

    setTriangleHeight(height) {
        if (height < this._triangleBoundaries.minHeight || height > this._triangleBoundaries.maxHeight) {
            throw new Error('Triangle height must be within the allowed range.');
        }
        this._triangleHeight = height;
    }

    render() {
        // thick arrow
        // <line x1="20" y1="20" x2="95" y2="20" stroke-width="3" stroke="green" stroke-linecap="round"></line>
        // <polygon points="95 10, 110 20, 95 30" fill="green"></polygon>

        // thin arrow
        // <line x1="20" y1="20" x2="105" y2="20" stroke-width="3" stroke="green" stroke-linecap="round"></line>
        // <polygon points="103 15, 110 20, 103 25" fill="green"></polygon>


        const lineLength = this._circleRadius + this._pointerLength - this._triangleWidth;
        const triangleTop = this._lineY - this._triangleHeight / 2;
        const triangleBottom = this._lineY + this._triangleHeight / 2;

        this._lineEl.setAttribute('x2', lineLength);
        this._triangleEl.setAttribute('points',
            `${lineLength} ${triangleTop},
            ${lineLength + this._triangleWidth} ${this._lineY},
            ${lineLength} ${triangleBottom}`);

        // <circle class="center-circle" cx="20" cy="20" r="20" fill="red"/>
        this._pointerEl.setAttribute('transform',
            `rotate(${this._angle} ${this._circleRadius} ${this._circleRadius})`);
    }
}