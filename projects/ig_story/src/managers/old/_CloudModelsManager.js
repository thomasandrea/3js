import * as THREE from "three";
import gsap from "gsap";

import cloud1Texture from "/textures/cloud/cloud-1.png?url";
import cloud2Texture from "/textures/cloud/cloud-2.png?url";

import cloud3Texture from "/textures/cloud/cloud-blur-01.png?url";
import cloud4Texture from "/textures/cloud/cloud-blur-02.png?url";

export default class CloudModelsManager {
  constructor() {
    this.manager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader();
  }

  loadCloud1(onReady) {
    this.textureLoader.load(cloud1Texture, (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      const height = 0.24; // o quello che vuoi
      const width = height * imageAspect;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });

      const cloud = new THREE.Mesh(geometry, material);
      cloud.position.set(-1, 0, 0);

      const startX = -1;
      const startZ = 0.1;

      const radius = 0.1; // raggio del cerchio
      const speed = 0.2; // velocità di movimento
      let angle = 0; // angolo di rotazione

      gsap.to(
        {},
        {
          duration: 1000, // animazione infinita, si ripete
          repeat: -1, // loop infinito
          onUpdate: () => {
            // Calcola nuove coordinate x, z sulla circonferenza
            cloud.position.x = startX + radius * Math.cos(angle);
            cloud.position.z = startZ + radius * Math.sin(angle);
            angle += (speed * Math.PI) / 180;
          },
        }
      );
      if (onReady) onReady(cloud);

      //scene.add(cloud);
    });
  }

  loadCloud2(onReady) {
    this.textureLoader.load(cloud2Texture, (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      const height = 0.5; // o quello che vuoi
      const width = height * imageAspect;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const cloud = new THREE.Mesh(geometry, material);
      cloud.position.set(1, -0.5, -0.5);
      if (onReady) onReady(cloud);
      //scene.add(cloud);
    });
  }

  loadCloud3(onReady) {
    this.textureLoader.load(cloud3Texture, (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      const height = 0.7; // o quello che vuoi
      const width = height * imageAspect;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const cloud = new THREE.Mesh(geometry, material);
      cloud.position.set(-3, 0.8, -1.5);
      if (onReady) onReady(cloud);
      //scene.add(cloud);
    });
  }

  loadCloud4(onReady) {
    this.textureLoader.load(cloud4Texture, (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      const height = 0.7; // o quello che vuoi
      const width = height * imageAspect;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const cloud = new THREE.Mesh(geometry, material);
      cloud.position.set(3, -1.4, -1.5);
      if (onReady) onReady(cloud);
      //scene.add(cloud);
    });
  }
}
