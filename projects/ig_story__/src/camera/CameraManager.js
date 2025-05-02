import * as THREE from 'three';

export default class CameraManager {
    constructor(sizes) {
        this.sizes = sizes;
        this.fov = 60;
        this.instance = new THREE.PerspectiveCamera(
            this.fov,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 1.5),
            new THREE.Vector3(0, 0, -13.8),
        ]);
        this.stepCamera(0);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    stepCamera(progress, delta = 0.0001) {
        const pos = this.curve.getPointAt(progress);
        this.instance.position.copy(pos);
    }

    update(progress) {
        this.stepCamera(progress);
    }
}