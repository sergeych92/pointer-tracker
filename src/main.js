import '../css/style.scss';

import { PointerRenderer } from './pointer-renderer';
import { SteadyAnimFeeder } from './steady-anim-feeder';
import { PathAnimFeeder } from './path-anim-feeder';
import { AnimFeederTypes } from './anim-feeder-types';

// Control selector
const feederSelectorEl = document.getElementById('feederSelector');
const controlsEL = document.querySelector('.controls')
let selectedAnimFeeder = AnimFeederTypes.path;

function setVisibilityForSteadyFeederControls(visible) {
    for (let el of controlsEL.querySelectorAll('[name=steadyFeederControl]')) {
        el.style.display = visible ? '' : 'none';
    }
}

function setVisibilityForPathFeederControls(visible) {
    controlsEL.querySelector('[name=pathFollowerControl]').style.display = visible ? '' : 'none';
}

function updateControlVisibility() {
    if (selectedAnimFeeder === AnimFeederTypes.path) {
        setVisibilityForSteadyFeederControls(false);
        setVisibilityForPathFeederControls(true);
    } else if (selectedAnimFeeder === AnimFeederTypes.steady) {
        setVisibilityForSteadyFeederControls(true);
        setVisibilityForPathFeederControls(false);
    }
}

feederSelectorEl.addEventListener('change', e => {
    selectedAnimFeeder = e.target.value;
    updateControlVisibility();
});
updateControlVisibility();

// Main part -- controlling animation with animation feeders
const fieldEl = document.querySelector('.field');
const circleEl = document.querySelector('.center-circle');
const pointerEl = document.querySelector('.pointer');
const rotationSpeedEl = document.getElementById('rotationSpeed');
const lengthChangeSpeedEl = document.getElementById('lengthChangeSpeed');
const travelSpeedEl = document.getElementById('travelSpeed');

const pointerRenderer = new PointerRenderer(circleEl, pointerEl);
const animSteadyFeeder = new SteadyAnimFeeder();
const pathAnimFeeder = new PathAnimFeeder();


fieldEl.addEventListener('mousemove', e => {
    const circleOrigin = circleEl.getBoundingClientRect();
    const relX = e.clientX - circleOrigin.left - pointerRenderer.getCircleRadius();
    const relY = e.clientY - circleOrigin.top - pointerRenderer.getCircleRadius();

    if (selectedAnimFeeder === AnimFeederTypes.path) {
        pathAnimFeeder.addPoint({relX, relY});
    } else if (selectedAnimFeeder === AnimFeederTypes.steady) {
        animSteadyFeeder.addPoint({relX, relY});
    }
});

rotationSpeedEl.value = animSteadyFeeder.getRotationSpeed();
rotationSpeedEl.addEventListener('input', e => {
    animSteadyFeeder.setRotationSpeed(parseFloat(e.target.value));
});

lengthChangeSpeedEl.value = animSteadyFeeder.getLengthChangeSpeed();
lengthChangeSpeedEl.addEventListener('input', e => {
    animSteadyFeeder.setLengthChangeSpeed(parseFloat(e.target.value));
});

travelSpeedEl.value = pathAnimFeeder.getSpeed();
travelSpeedEl.addEventListener('input', e => {
    pathAnimFeeder.setSpeed(parseFloat(e.target.value));
});

function drawFrame(deltaT) {
    let angle, length;

    if (selectedAnimFeeder === AnimFeederTypes.path) {
        const response = pathAnimFeeder.getNextAngleAndLength(deltaT);
        angle = response.angle;
        length = response.length;
    } else if (selectedAnimFeeder === AnimFeederTypes.steady) {
        angle = animSteadyFeeder.getNextAngle(deltaT);
        length = animSteadyFeeder.getNextLength(deltaT);
    }
    
    pointerRenderer.rotatePointer(angle);
    pointerRenderer.setPointerLength(length);
}

let prevTime = null;
requestAnimationFrame(function nextFrame(time) {
    if (!prevTime) {
        prevTime = time;
    }
    const deltaT = time - prevTime;
    prevTime = time;
    drawFrame(deltaT);
    requestAnimationFrame(nextFrame);
});
