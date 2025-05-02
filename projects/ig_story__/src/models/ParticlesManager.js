import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export default class ParticlesManager {
    constructor(scene, uniforms) {
        this.scene = scene;
        this.uniforms = uniforms;
    }

    createParticlesFromMesh(mesh, vertexShader, fragmentShader, numParticle = 20000) {
        const colorParticle = new THREE.Color();
        colorParticle.setRGB(0 / 255, 138 / 255, 194 / 255);

        const sampler = new MeshSurfaceSampler(mesh).build();
        const num = numParticle;
        const geometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(num * 3);
        const colorArray = new Float32Array(num * 3);
        const offsetArray = new Float32Array(num);

        const pos = new THREE.Vector3();

        for (let i = 0; i < num; i++) {
            sampler.sample(pos);
            positionArray.set([pos.x, pos.y, pos.z], i * 3);

            const [r, g, b] = colorParticle || [1, 1, 1];
            colorArray.set([r, g, b], i * 3);

            offsetArray[i] = Math.random();
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
        geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                ...this.uniforms,
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        return particles;
    }
}