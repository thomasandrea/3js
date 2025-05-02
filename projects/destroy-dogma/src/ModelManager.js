import * as THREE from "three";

import gioconda from "./textures/gioconda.jpg";

function giocondaPaint( onReady) {
    const canvasDepth = 0.1;
  
    const loader = new THREE.TextureLoader();
    loader.load(
      gioconda,
      (texture) => {
        const image = texture.image;
        const aspect = image.width / image.height;
  
        // Definiamo la base come altezza costante e calcoliamo la larghezza
        const canvasHeight = 1.5;
        const canvasWidth = canvasHeight * aspect;
  
        // Crea la box dietro
        const boxGeometry = new THREE.BoxGeometry(canvasWidth+.1, canvasHeight+.1, canvasDepth);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  
        // Crea la geometria del piano frontale con lo stesso aspect ratio
        const planeGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uMouse: { value: new THREE.Vector2()}
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main() {
              gl_FragColor = texture2D(uTexture, vUv);
            }
          `,
          side: THREE.FrontSide,
        });
  
        const frontMesh = new THREE.Mesh(planeGeometry, shaderMaterial);
        frontMesh.position.z = canvasDepth / 2 + 0.001;
  
        const quadro = new THREE.Group();
        quadro.add(boxMesh);
        quadro.add(frontMesh);
        quadro.position.y = 1;
  
        // Callback per restituire il quadro quando pronto
        if (onReady) onReady({quadro, frontMesh});
      },
      undefined,
      (err) => {
        console.error("Errore nel caricamento texture:", err);
      }
    );
  }

export { giocondaPaint };
