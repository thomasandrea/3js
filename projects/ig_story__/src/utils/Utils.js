import * as THREE from 'three';

export function disposeModel(gltf) {
    gltf.scene.traverse((el) => {
        if (el.isMesh) {
            el.geometry.dispose();
            if (Array.isArray(el.material)) {
                el.material.forEach(mat => mat.dispose());
            } else {
                el.material.dispose();
            }
        }
    });
}