import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { FishEyeShader } from './fisheyeShader.js';

// Escena básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#effects'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const filmPass = new FilmPass(0.9, 0.5, 300, 0,)
composer.addPass(filmPass)

const fishEyePass = new ShaderPass(FishEyeShader);
fishEyePass.uniforms.strength.value = 0.35; // puedes ajustarlo
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

  let random = (Math.floor((Math.random() * 150) + 1));
  var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  random = random * plusOrMinus;
  console.log(filmPass.uniforms)
  console.log(random)
  filmPass.uniforms['sCount'].value += random

  composer.render();
}
animate();
