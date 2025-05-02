import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class ControlsManager {
    constructor(camera, renderer) {
        this.instance = new OrbitControls(camera, renderer.domElement);
        this.instance.enableDamping = true;
    }

    update() {
        this.instance.update();
    }
}