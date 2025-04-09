import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { FishEyeShader } from './shaders/fisheyeShader.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { ChromaticAberrationShader } from './shaders/chromaticShader.js';
import { TextScrambleAnimation } from "./textScrambleAnimation.js"

// Escena básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;
setTimeout(()=>{
  TextScrambleAnimation(document.querySelector('div[terminal-text] h2.home-subheading'))
}, 8000)

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#effects'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// const filmPass = new FilmPass(0.9, 0.5)
// composer.addPass(filmPass)

// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

const fishEyePass = new ShaderPass(FishEyeShader);
fishEyePass.uniforms.strength.value = 0.3; 
composer.addPass(fishEyePass);

// Resize handler
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
animate();
