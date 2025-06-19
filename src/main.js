import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsapTimelines } from "./gsapTimelines.js";
import { TextScrambleAnimation } from "./textScrambleAnimation.js";
import { chapter1 } from "./chapter-1.js";
import { Howl } from "howler";

// Inicialización del composer
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FishEyeShader } from "./shaders/fisheyeShader.js"

gsap.config({ force3D: false })

// index.js
// ---------
// 1) Captura todo sólo cuando el DOM esté listo
// window.Webflow && window.Webflow.push(function () {
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  
  //Avoid scrolltrigger hijacking by in
  window.addEventListener('load', () => {
      gsapTimelines();

    setTimeout(() => {
      ScrollTrigger.refresh();
  }, 100);
  })
  
  // 2) Logger en pantalla (VITE env vars)
  const logContainer = document.createElement("div");
  Object.assign(logContainer.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    maxHeight: "200px",
    overflowY: "auto",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "12px",
    padding: "10px",
    boxSizing: "border-box",
    zIndex: "99999",
  });
  document.body.prepend(logContainer);

  const buildNumber = import.meta.env.VITE_BUILD_NUMBER || "N/A";
  const commitSHA = import.meta.env.VITE_COMMIT_SHA || "N/A";
  const startTime = import.meta.env.VITE_START_TIME || "N/A";

  const msg = document.createElement("div");
  msg.textContent = `
      Hora de inicio: ${startTime}
      Build Number: ${buildNumber}
      Commit SHA: ${commitSHA}
    `;
  logContainer.appendChild(msg);
  console.log(`
      Hora de inicio: ${startTime}
      Build Number: ${buildNumber}
      Commit SHA: ${commitSHA}
    `)

  // 3) Three.js + EffectComposer
  const canvas = document.querySelector("#effects");
  if (!canvas) {
    console.error("Canvas #effects no encontrado — verifique su HTML");
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4;



  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const fishEyePass = new ShaderPass(FishEyeShader);
  fishEyePass.uniforms.strength.value = 0.3;
  composer.addPass(fishEyePass);

  // Función para tamaño correcto
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === 0 || h === 0) return; // evita framebuffers de tamaño cero
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    if(window.ScrollTrigger){
      ScrollTrigger.refresh();
    }
  }

  window.addEventListener("resize", onResize, { passive: true });
  onResize(); // llamada inicial

  // 4) Loop de animación
  function animate() {
    requestAnimationFrame(animate);
    composer.render();
  }
  animate(); // arranca el loop


  // 6) Text scramble con IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          TextScrambleAnimation(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1 }
  );
  document
    .querySelectorAll("[terminal-text] h4")
    .forEach((el) => {
      const texto = el.textContent.trim().toLowerCase();
      if (texto.includes('heading')) {
        observer.observe(el);
      }
    });

  // 7) Gestión de audio con Howler
  const sound = new Howl({
    src: ["https://evilspider-webgl.alejandra-piedra.com/evil-spider.mp3"],
    volume: 0.1,
    onplayerror() {
      sound.once("unlock", () => sound.play());
    },
  });
  document.querySelectorAll(".main-btn, .sound-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      sound.playing() ? sound.pause() : sound.play()
    );
  });
});
// });
