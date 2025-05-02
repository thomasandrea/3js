import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { disposeModel } from '../utils/Utils.js';
import ParticlesManager from './ParticlesManager.js';

export default class ModelLoader {
    constructor(scene, loadingManager, uniforms) {
        this.scene = scene;
        this.loadingManager = loadingManager;
        this.loader = new GLTFLoader(this.loadingManager);
        this.uniforms = uniforms;
        this.models = {};
        this.particlesManager = new ParticlesManager(this.scene, this.uniforms);
    }

    loadModel(src, vertexShader, fragmentShader, modelName, scale = new THREE.Vector3(1, 1, 1), rotation = new THREE.Euler(0, 0, 0), position = new THREE.Vector3(0, 0, 0), numParticles = 20000) {
        this.loader.load(src, (gltf) => {
            let model;
            gltf.scene.traverse((el) => {
                if (el instanceof THREE.Mesh) {
                    model = el;
                }
            });

            if (model) {
                model.geometry.scale(scale.x, scale.y, scale.z);
                model.geometry.rotateX(rotation.x);
                model.geometry.rotateY(rotation.y);
                model.geometry.rotateZ(rotation.z);
                this.models[modelName] = this.particlesManager.createParticlesFromMesh(model, vertexShader, fragmentShader, numParticles);
                this.models[modelName].position.copy(position);
                disposeModel(gltf);
            }
        }, undefined, (error) => {
            console.error(`Errore nel caricamento del modello ${src}`, error);
        });
    }

    update(deltaTime) {
        if (this.models.globe) {
            const rotationSpeed = Math.PI / 64;
            this.models.globe.rotation.y -= rotationSpeed * deltaTime;
        }
    }
}