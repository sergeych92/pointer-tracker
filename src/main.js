import '../css/style.scss';

import { PointerRenderer } from './pointer-renderer';
import { SteadyAnimFeeder } from './steady-anim-feeder';
import { PathAnimFeeder } from './path-anim-feeder';
import { TargetAnimFeeder } from './target-anim-feeder';
import { AnimFeederTypes } from './anim-feeder-types';
import { SpeedControlsManager } from './speed-controls-manager';

const fieldEl = document.querySelector('.field');
const circleEl = document.querySelector('.center-circle');
const pointerEl = document.querySelector('.pointer');


let selectedAnimFeeder = null;

const speedControlsManager = new SpeedControlsManager();
const pointerRenderer = new PointerRenderer(circleEl, pointerEl);
const animSteadyFeeder = new SteadyAnimFeeder();
const pathAnimFeeder = new PathAnimFeeder();
const targetAnimFeeder = new TargetAnimFeeder();

speedControlsManager.init({
    listeners: {
        onAnimFeederSelected: selected => {
            selectedAnimFeeder = selected;
        },
        onRotationSpeedChange: speed => animSteadyFeeder.setRotationSpeed(speed),
        onLengthChangeSpeedChange: speed => animSteadyFeeder.setLengthChangeSpeed(speed),
        onPathTravelSpeedChange: speed => pathAnimFeeder.setSpeed(speed),
        onTargetFollowSpeedChange: speed => targetAnimFeeder.setSpeed(speed)
    },
    initData: {
        rotationSpeed: animSteadyFeeder.getRotationSpeed(),
        lengthChangeSpeed: animSteadyFeeder.getLengthChangeSpeed(),
        pathTravelSpeed: pathAnimFeeder.getSpeed(),
        targetFollowSpeed: targetAnimFeeder.getSpeed()
    }
});

fieldEl.addEventListener('mousemove', e => {
    const circleOrigin = circleEl.getBoundingClientRect();
    const relX = e.clientX - circleOrigin.left - pointerRenderer.getCircleRadius();
    const relY = e.clientY - circleOrigin.top - pointerRenderer.getCircleRadius();

    if (selectedAnimFeeder === AnimFeederTypes.path) {
        pathAnimFeeder.addPoint({relX, relY});
    } else if (selectedAnimFeeder === AnimFeederTypes.steady) {
        animSteadyFeeder.addPoint({relX, relY});
    } else if (selectedAnimFeeder === AnimFeederTypes.target) {
        targetAnimFeeder.addPoint({relX, relY});
    }
});

function drawFrame(deltaT) {
    let angle, length;

    if (selectedAnimFeeder === AnimFeederTypes.path) {
        const response = pathAnimFeeder.getNextAngleAndLength(deltaT);
        angle = response.angle;
        length = response.length;
    } else if (selectedAnimFeeder === AnimFeederTypes.target) {
        const response = targetAnimFeeder.getNextAngleAndLength(deltaT);
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
