import gsap from "gsap";
import { config } from "../config";

export default class Navigation {
    constructor(camera, cameraTimeline) {
      this.camera = camera
      this.cameraTrigger = cameraTimeline.scrollTrigger;
      this.buttons = document.querySelectorAll('.navigation__btn');
      this.activeIndex = -1;
      this.isNavigationVisible = false;
      this.showNavigationAtZ= -5;
      this.navigationElement = document.querySelector('.navigation');
      this.bindEvents();
    }
  
    bindEvents() {
      this.buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => this.scrollToStep(index));
      });
    }
  
    scrollToStep(index) {
        const targetProgress = config.camera.progress.step[index];
        const targetScrollY = this.cameraTrigger.start +
          targetProgress * (this.cameraTrigger.end - this.cameraTrigger.start);
      
        const currentScrollY = window.scrollY;
        const distance = Math.abs(targetScrollY - currentScrollY);
      
        // Calcola durata proporzionale (es: 1000px = 1.5s), con limite minimo e massimo
        const duration = gsap.utils.clamp(0.3, 2.5, distance / 1000 * 1.5);
      
        gsap.to(window, {
          scrollTo: targetScrollY,
          duration,
          ease: "power2.out"
        });
    }
  
    update(camera) {
        const scroll = window.scrollY;
        const start = this.cameraTrigger.start;
        const end = this.cameraTrigger.end;
        const currentProgress = (scroll - start) / (end - start);


        //check visibility bar
        if (!this.isNavigationVisible && this.camera.position.z < this.showNavigationAtZ) {
          this.isNavigationVisible = true;
          gsap.to(this.navigationElement, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        } else if (this.isNavigationVisible && this.camera.position.z >= this.showNavigationAtZ) {
          this.isNavigationVisible = false;
          gsap.to(this.navigationElement, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
          });
        }


      
        // Se il progress è inferiore al primo step, nessun attivo
        if (currentProgress < config.camera.progress.step[0]) {
          this.setActiveButton(-1); // Nessun attivo
          return;
        }
      
        let closestIndex = 0;
        let minDelta = Infinity;
      
        config.camera.progress.step.forEach((p, i) => {
          const delta = Math.abs(p - currentProgress);
          if (delta < minDelta) {
            minDelta = delta;
            closestIndex = i;
          }
        });
      
        if (closestIndex !== this.activeIndex) {
          this.setActiveButton(closestIndex);
        }
      }
      
  
      setActiveButton(index) {
        this.buttons.forEach(btn => btn.classList.remove('active'));
        if (index >= 0 && this.buttons[index]) {
          this.buttons[index].classList.add('active');
        }
        this.activeIndex = index;
      }
  }
  