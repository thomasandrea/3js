import * as THREE from 'three';

export default class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.clouds = [];
        this.loadClouds();
    }

    loadClouds() {
        const cloudData = [
            { src: '/textures/cloud/cloud-1.png?url', height: 0.24, position: new THREE.Vector3(-1, 0, 0), radius: 0.1, speed: 0.2 },
            { src: '/textures/cloud/cloud-2.png?url', height: 0.5, position: new THREE.Vector3(1, -0.5, -0.5) },
            { src: '/textures/cloud/cloud-blur-01.png?url', height: 0.7, position: new THREE.Vector3(-3, 0.8, -1.5) },
            { src: '/textures/cloud/cloud-blur-02.png?url', height: 0.7, position: new THREE.Vector3(3, -1.4, -1.5) },
        ];

        cloudData.forEach(data => {
            this.textureLoader.load(data.src, (texture) => {
                const imageAspect = texture.image.width / texture.image.height;
                const width = data.height * imageAspect;
                const geometry = new THREE.PlaneGeometry(width, data.height);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    depthWrite: false,
                });
                const cloud = new THREE.Mesh(geometry, material);
                cloud.position.copy(data.position);

                if (data.radius && data.speed) {
                    const startX = data.position.x;
                    const startZ = data.position.z;
                    let angle = 0;
                    gsap.to(
                        {},
                        {
                            duration: 1000,
                            repeat: -1,
                            onUpdate: () => {
                                cloud.position.x = startX + data.radius * Math.cos(angle);
                                cloud.position.z = startZ + data.radius * Math.sin(angle);
                                angle += (data.speed * Math.PI) / 180;
                            },
                        }
                    );
                }

                this.clouds.push(cloud);
                this.scene.add(cloud);
            });
        });
    }
}