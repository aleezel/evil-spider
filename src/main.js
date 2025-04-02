import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuración inicial
const init = () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Configura controls, luces, objetos...
  new OrbitControls(camera, renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

// Inicializa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);