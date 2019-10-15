import '../css/style.scss';

import { PointerRenderer } from './pointer-renderer';
import { SteadyAnimFeeder } from './steady-anim-feeder';
import { PathAnimFeeder } from './path-anim-feeder';
import { TargetAnimFeeder } from './target-anim-feeder';
import { AnimFeederTypes } from './anim-feeder-types';
import { SpeedControlsManager } from './speed-controls-manager';
import { PointerThicknessFilter } from './thickness-pointer-filter';
import { MathUtils } from './math-utils';

const fieldEl = document.querySelector('.field');
let selectedAnimFeeder = AnimFeederTypes.steady;

const speedControlsManager = new SpeedControlsManager();
const pointerRenderer = new PointerRenderer();

// animation feeders (convert mousemove events into pointer position)
const steadyAnimFeeder = new SteadyAnimFeeder();
steadyAnimFeeder.setPosition(pointerRenderer.getPointerCoords());

const pathAnimFeeder = new PathAnimFeeder();
pathAnimFeeder.setPosition(pointerRenderer.getPointerCoords());

const targetAnimFeeder = new TargetAnimFeeder();
targetAnimFeeder.setPosition(pointerRenderer.getPointerCoords());

function getAnimFeeder(selectedFlag) {
    if (selectedFlag === AnimFeederTypes.path) {
        return pathAnimFeeder;
    } else if (selectedFlag === AnimFeederTypes.steady) {
        return steadyAnimFeeder;
    } else if (selectedFlag === AnimFeederTypes.target) {
        return targetAnimFeeder;
    }
}

const pointerThicknessFilter = new PointerThicknessFilter({
    viewportDim: {
        width: fieldEl.clientWidth,
        height: fieldEl.clientHeight
    },
    pointerMax: pointerRenderer.getTriangleBoundaries(),
    pointerDim: pointerRenderer.getTriangleDim()
});

speedControlsManager.init({
    listeners: {
        onAnimFeederSelected: nextSelected => {
            const prevAnimFeeder = getAnimFeeder(selectedAnimFeeder);
            const nextAnimFeeder = getAnimFeeder(nextSelected);
            selectedAnimFeeder = nextSelected;

            nextAnimFeeder.setPosition(prevAnimFeeder.getPosition());
        },
        onRotationSpeedChange: speed => steadyAnimFeeder.setRotationSpeed(speed),
        onLengthChangeSpeedChange: speed => steadyAnimFeeder.setLengthChangeSpeed(speed),
        onPathTravelSpeedChange: speed => pathAnimFeeder.setSpeed(speed),
        onTargetFollowSpeedChange: speed => targetAnimFeeder.setSpeed(speed)
    },
    initData: {
        selectedAnimFeeder, 
        rotationSpeed: steadyAnimFeeder.getRotationSpeed(),
        lengthChangeSpeed: steadyAnimFeeder.getLengthChangeSpeed(),
        pathTravelSpeed: pathAnimFeeder.getSpeed(),
        targetFollowSpeed: targetAnimFeeder.getSpeed()
    }
});

fieldEl.addEventListener('mousemove', e => {
    const point = pointerRenderer.getCoordsRelativeToCenter(e.clientX, e.clientY);
    getAnimFeeder(selectedAnimFeeder).addPoint(point);
    pointerThicknessFilter.setNextPoint(point);
});

function drawFrame(deltaT) {
    let drawnPointerInfo;

    // calculate pointer length and angle
    if (selectedAnimFeeder === AnimFeederTypes.path) {
        drawnPointerInfo = pathAnimFeeder.getNextAngleAndLength(deltaT);
    } else if (selectedAnimFeeder === AnimFeederTypes.target) {
        drawnPointerInfo = targetAnimFeeder.getNextAngleAndLength(deltaT);
    } else if (selectedAnimFeeder === AnimFeederTypes.steady) {
        const angle = steadyAnimFeeder.getNextAngle(deltaT);
        const length = steadyAnimFeeder.getNextLength(deltaT);
        drawnPointerInfo = {
            angle,
            length,
            point: MathUtils.angleAndLengthToPoint(angle, length)
        };
    }
    
    // calculate pointer thickness
    pointerThicknessFilter.setPrevPoint(drawnPointerInfo.point);
    let thickness = pointerThicknessFilter.getPointerThickness();
    
    // set coordinates and sizes and render
    pointerRenderer.setTriangleWidth(thickness.width);
    pointerRenderer.setTriangleHeight(thickness.height);
    pointerRenderer.rotate(drawnPointerInfo.angle);
    pointerRenderer.setLength(drawnPointerInfo.length);
    pointerRenderer.render();

    // TODO:
    // put the pointer in the correct initial state when loaded (init prevPoint and size)

    // add distance-dependent filters:
    // add smothness filter from smooth to crisp

    // show the angle and distance

    // once a click is made to set a final target:
    // add a red dot indicating its position
    // when the pointer reaches the target, change its color from green to yellow or red in 2 seconds
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

pointerRenderer.render();
