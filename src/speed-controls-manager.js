import { AnimFeederTypes } from './anim-feeder-types';

export class SpeedControlsManager {
    constructor() {
        this._formControlsEl = document.querySelector('.controls');
        this._feederSelectorEl = document.getElementById('feederSelector');

        this._steadyFeederControls = this._formControlsEl.querySelectorAll('[name=steadyFeederControl]');
        this._pathFeederControl = this._formControlsEl.querySelector('[name=pathFeederControl]');
        this._targetFeederControl = this._formControlsEl.querySelector('[name=targetFeederControl]');

        this._rotationSpeedEl = document.getElementById('rotationSpeed');
        this._lengthChangeSpeedEl = document.getElementById('lengthChangeSpeed');
        this._pathTravelSpeedEl = document.getElementById('pathTravelSpeed');
        this._targetFollowSpeedEl = document.getElementById('targetFollowSpeed');

        this._selectedAnimFeeder = AnimFeederTypes.path;
    }

    init({
        listeners: {
            onAnimFeederSelected,
            onRotationSpeedChange,
            onLengthChangeSpeedChange,
            onPathTravelSpeedChange,
            onTargetFollowSpeedChange
        },
        initData: {
            selectedAnimFeeder,
            rotationSpeed,
            lengthChangeSpeed,
            pathTravelSpeed,
            targetFollowSpeed
        }
    }) {
        this._selectedAnimFeeder = selectedAnimFeeder;
        this._onAnimFeederSelected = onAnimFeederSelected;
        
        const activeRadioEl = this._feederSelectorEl.querySelector(`input[type=radio][value=${selectedAnimFeeder}]`);
        activeRadioEl.checked = true;


        this._feederSelectorEl.addEventListener('change', e => {
            this._selectedAnimFeeder = e.target.value;
            this._updateControlVisibility();
        });
        this._updateControlVisibility();

        this._rotationSpeedEl.value = rotationSpeed;
        this._rotationSpeedEl.addEventListener('input', e => {
            onRotationSpeedChange.call(null, parseFloat(e.target.value));
        });

        this._lengthChangeSpeedEl.value = lengthChangeSpeed;
        this._lengthChangeSpeedEl.addEventListener('input', e => {
            onLengthChangeSpeedChange.call(null, parseFloat(e.target.value));
        });

        this._pathTravelSpeedEl.value = pathTravelSpeed;
        this._pathTravelSpeedEl.addEventListener('input', e => {
            onPathTravelSpeedChange.call(null, parseFloat(e.target.value));
        });

        this._targetFollowSpeedEl.value = targetFollowSpeed;
        this._targetFollowSpeedEl.addEventListener('input', e => {
            onTargetFollowSpeedChange.call(null, parseFloat(e.target.value));
        });
    }

    _updateControlVisibility() {
        if (this._selectedAnimFeeder === AnimFeederTypes.path) {
            this._setPathFeederVisibility(true);
            this._setSteadyFeederVisibility(false);
            this._setTargetFeederVisibility(false);
        } else if (this._selectedAnimFeeder === AnimFeederTypes.steady) {
            this._setPathFeederVisibility(false);
            this._setSteadyFeederVisibility(true);
            this._setTargetFeederVisibility(false);
        } else if (this._selectedAnimFeeder === AnimFeederTypes.target) {
            this._setPathFeederVisibility(false);
            this._setSteadyFeederVisibility(false);
            this._setTargetFeederVisibility(true);
        }

        this._onAnimFeederSelected.call(null, this._selectedAnimFeeder);
    }

    _setSteadyFeederVisibility(visible) {
        for (let el of this._steadyFeederControls) {
            el.style.display = visible ? '' : 'none';
        }
    }

    _setPathFeederVisibility(visible) {
        this._pathFeederControl.style.display = visible ? '' : 'none';
    }

    _setTargetFeederVisibility(visible) {
        this._targetFeederControl.style.display = visible ? '' : 'none';
    }
}
