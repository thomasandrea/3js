import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export default class AnimationManager {
    constructor(config, cameraManager, backgroundManager) {
        this.config = config;
        this.cameraManager = cameraManager;
        this.backgroundManager = backgroundManager;
        this.scrollEventListeners = []; // Array per i tuoi gestori di eventi
        this.setupScrollAnimations();
    }

    addScrollEventListener(percentage, callback) {
        this.scrollEventListeners.push({ percentage: percentage, callback: callback });
        // Ordina gli eventi per percentuale per un'elaborazione efficiente
        this.scrollEventListeners.sort((a, b) => a.percentage - b.percentage);
    }

    checkScrollEvents() {
        const currentProgress = this.config.progress;

        for (const event of this.scrollEventListeners) {
            if (currentProgress >= event.percentage && !event.triggered) {
                event.callback();
                event.triggered = true; // Imposta un flag per non riattivare l'evento
            } else if (currentProgress < event.percentage && event.triggered) {
                event.triggered = false; // Resetta il flag se si torna indietro
            }
        }
    }

    setupScrollAnimations() {
        gsap.to(this.config, {
            progress: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "#app",
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
                onUpdate: () => {
                    this.cameraManager.update(this.config.progress);
                    this.updateBackgroundWithFade();
                    this.updateFirsSceneText();
                    this.updateSecondSceneText();
                    this.checkScrollEvents(); // Controlla gli eventi basati sulla posizione
                }
            },
        });
    }

    updateBackgroundWithFade() {
        const bg = document.querySelector('#bgSecondScene');
        const maxDistance = -5;
        const minDistance = -12;
        const normalizedPosition = THREE.MathUtils.clamp((this.cameraManager.instance.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
        const opacity = normalizedPosition;
        const scale = 1 + normalizedPosition * 0.2;
        gsap.to(bg, { opacity: opacity, scale: scale, duration: 0.5 });
    }

    updateFirsSceneText() {
        const bg = document.querySelector('#firstSceneText');
        const maxDistance = -.9;
        const minDistance = 0;
        const normalizedPosition = THREE.MathUtils.clamp((this.cameraManager.instance.position.z - maxDistance) / (minDistance - minDistance), 0, 1);
        const opacity = normalizedPosition;
        gsap.to(bg, { opacity: opacity });
    }

    updateSecondSceneText() {
        const bg = document.querySelector('#secondSceneText');
        const minDistance = -3;
        const maxDistance = 0;
        const normalizedPosition = THREE.MathUtils.clamp((this.cameraManager.instance.position.z - maxDistance) / (minDistance - maxDistance), 0, 1);
        const opacity = normalizedPosition;
        gsap.to(bg, { opacity: opacity });
    }
}