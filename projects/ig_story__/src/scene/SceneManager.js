import * as THREE from 'three';

export default class SceneManager {
    constructor() {
        this.instance = new THREE.Scene();
        this.background = null; // Puoi aggiungere una gestione dello sfondo qui se necessario
    }

    add(object) {
        this.instance.add(object);
    }

    remove(object) {
        this.instance.remove(object);
    }

    update() {
        // Aggiornamenti specifici della scena se necessario
    }
}