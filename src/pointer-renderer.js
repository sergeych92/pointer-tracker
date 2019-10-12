export class PointerRenderer {
    constructor(circleEl, pointerEl) {
        this._circleEl = circleEl;
        this._pointerEl = pointerEl;
        
        this._circleRadius = 20;
        this._lineY = 20;
        this._triangleEdge = 10;
    }

    getCircleRadius() {
        return this._circleRadius;
    }

    // x and y are relative to the rotation origin
    rotatePointer(angle) {
        this._pointerEl.setAttribute('transform',
            `rotate(${angle} ${this._circleRadius} ${this._circleRadius})`);
        // <circle class="center-circle" cx="20" cy="20" r="20" fill="red"/>
    }

    // set the length of the pointers
    setPointerLength(length) {
        const lineEl = this._pointerEl.firstElementChild;
        const triangleEl = this._pointerEl.lastElementChild;
        const lineLength = length + this._circleRadius;
        lineEl.setAttribute('x2', lineLength);
        triangleEl.setAttribute('points',
            `${lineLength} ${this._lineY - this._triangleEdge},
            ${lineLength + this._triangleEdge} ${this._lineY},
            ${lineLength} ${this._lineY + this._triangleEdge}`);
        // <line x1="20" y1="20" x2="100" y2="20" stroke-width="6" stroke="green" />
        // <polygon points="100 10, 110 20, 100 30" fill="green" />
    }
}