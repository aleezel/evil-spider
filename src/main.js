// 1) Crear dinámicamente el contenedor para los logs
const logContainer = document.createElement('div');
logContainer.setAttribute('id', 'log-output');

// Estilo para el contenedor de logs
Object.assign(logContainer.style, {
  position: 'fixed',
  bottom: '0',
  left: '0',
  right: '0',
  maxHeight: '200px',
  overflowY: 'auto',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  fontSize: '12px',
  padding: '10px',
  boxSizing: 'border-box',
  zIndex: '99999'
});

// Insertar el contenedor al final del body
// document.body.appendChild(logContainer);
document.body.prepend(logContainer);

const message = document.createElement('div');
// 2) Variables inyectadas por Vite
const buildNumber = import.meta.env.VITE_BUILD_NUMBER;
const commitSHA = import.meta.env.VITE_COMMIT_SHA;

// 3) Mostrar valores en pantalla
const textoparamostrar = `
  La hora de inicio fue: ${import.meta.env.VITE_START_TIME}
  Build Number: ${buildNumber || 'N/A'}
  Commit SHA: ${commitSHA || 'N/A'}
`;
message.textContent = textoparamostrar
logContainer.appendChild(message);
// console.log(textoparamostrar)

// import * as THREE from 'three';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { FishEyeShader } from './shaders/fisheyeShader.js';
import { TextScrambleAnimation } from "./textScrambleAnimation.js";
// import { TransitionsManager } from './transitions/main.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsapTimelines } from "./gsapTimelines.js";
import { SongManager } from "./songManager.js";
import { Howl, Howler } from 'howler';
try {
  // Configuración inicial
  // const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // camera.position.z = 4;

  // // Configuración del renderer
  // const renderer = new THREE.WebGLRenderer({
  //   canvas: document.querySelector('#effects'),
  //   antialias: true,
  //   alpha: true,
  //   powerPreference: 'high-performance'
  // });

  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer.autoClear = false;

  // // Configuración del EffectComposer
  // const composer = new EffectComposer(renderer);
  // composer.addPass(new RenderPass(scene, camera));

  // // Añadir efectos post-procesamiento
  // const fishEyePass = new ShaderPass(FishEyeShader);
  // fishEyePass.uniforms.strength.value = 0.3;
  // composer.addPass(fishEyePass);

  // // Inicializar TransitionsManager
  // const transitionsManager = new TransitionsManager(renderer, composer);

  // // Animación principal optimizada
  // let lastFrameTime = performance.now();
  // const animate = (currentTime) => {
  //   const deltaTime = currentTime - lastFrameTime;
  //   lastFrameTime = currentTime;

  //   requestAnimationFrame(animate);

  //   renderer.clear();
  //   composer.render(deltaTime);
  // };

  // Manejo de resize optimizado
  // const resizeObserver = new ResizeObserver(entries => {
  //   const { width, height } = entries[0].contentRect;

  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();

  //   renderer.setSize(width, height);
  //   composer.setSize(width, height);
  // });

  // resizeObserver.observe(renderer.domElement);

  // window.addEventListener('resize', () => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(width, height);
  //   composer.setSize(width, height);
  // });

  // // Iniciar animación
  // animate();

  // Ejemplo de uso de la transición
  // async function startSceneTransition() {
  //   try {
  //     const transition = await transitionsManager.createTransition(
  //       'https://evilspider-webgl.alejandra-piedra.com/home-section.png',
  //       'https://evilspider-webgl.alejandra-piedra.com/evil-spider.png'
  //     );

  //     transition.startTransition()
  //   } catch (error) {
  //     console.error('Transition failed:', error);
  //   }
  // }

  // const callback = (entries) => {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       // Elemento está visible
  //       // console.log(`${entry.target.id} está visible en un ${entry.intersectionRatio * 100}%`);
  //       // startSceneTransition();
  //     } else {
  //       // Elemento no está visible
  //     }
  //   });
  // };
  // const options = {
  //   root: null, // Elemento contenedor (null = viewport)
  //   rootMargin: '0px', // Márgenes del root
  //   threshold: 0.05 // Umbral(es) de visibilidad (ej: [0, 0.25, 0.5, 1])
  // }
  // const observer = new IntersectionObserver(callback, options);
  // const target = document.querySelector('.spider-section');
  // observer.observe(target);


  // Iniciar la transición después de la animación del texto
  // const introText = document.querySelector('div[terminal-text] h2.home-subheading');
  // // console.log(introText)
  // introText.style.visibility = 'hidden';

  // setTimeout(() => {
  //     TextScrambleAnimation(introText);
  //   }, 8000);
  // const scrombledTexts = document.querySelectorAll('[terminal-text]')
  // scrombledTexts.forEach(text => {
  //   ScrollTrigger.create({
  //     trigger: text,
  //     onEnter: ({progress, direction, isActive}) => {
  //       TextScrambleAnimation(text);
  //     }
  // });
  // });



  gsapTimelines();

  // // console.log(scrombledTexts)
  // scrombledTexts.forEach((textContainer) => {
  //   const nestedTextElements = textContainer.querySelectorAll('h4');
  //   // console.log(nestedTextElements)
  //   // console.log('else')
  //   // console.log(textContainer)
  //   ScrollTrigger.create({
  //     trigger: textContainer,
  //     onEnter: ({ progress, direction, isActive }) => {
  //       // console.log(`Esta entrando ${$(textContainer)?.text()?.split('')}`)
  //       TextScrambleAnimation(textContainer);
  //     }
  //   });
  // }
  //   // }
  // );
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      console.log({ entry })
      if (entry.isIntersecting) {
        // El elemento ha entrado en el viewport
        // console.log(`Está entrando: ${entry.target.textContent.split('')}`);

        // Llamamos a la animación de scramble
        console.log("llega al scabled")
        const target = entry.target
        TextScrambleAnimation(target);

        // Si deseas que la animación ocurra solo una vez,
        // puedes dejar de observar este elemento:
        // obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,     // Observa en relación al viewport
    threshold: 0.1  // Umbral de visibilidad al 10%
  });

  // 3. Observamos cada elemento
  const scrombledTexts = document.querySelectorAll('[terminal-text]')
  scrombledTexts.forEach((textContainer) => {
    const nestedTextElements = textContainer.querySelectorAll('h4');
    // console.log('Elementos <h4> anidados:', nestedTextElements);
    // console.log(textContainer);
    // console.log('else');

    // Iniciamos la observación
    observer.observe(nestedTextElements);
  });

  ScrollTrigger.sort();


  let currentVol = 1
  var sound = new Howl({
    src: ['https://evilspider-webgl.alejandra-piedra.com/evil-spider.mp3'],
    volume: currentVol,
    onplayerror: function () {
      sound.once('unlock', function () {
        sound.play();
      });
    },
    onloaderror(id, err) {
      console.error('failed to load sound file:', { id, err })
    }
  });

  const inicio = document.querySelector(".main-btn")
  inicio.addEventListener("click", () => {
    if (sound.playing()) {
      sound.pause()
      return
    }
    sound.play();
  })

  const soundButton = document.querySelector(".sound-btn")
  soundButton.addEventListener("click", () => {
    if (sound.playing()) {
      sound.pause()
      return
    }
    sound.play();
  })

  // const bajale = document.querySelector(".bajale")
  // bajale.addEventListener("click", () => {
  //   if (currentVol <= 0) {
  //     return
  //   }
  //   currentVol += -0.1
  //   sound.volume(currentVol);
  // })

  // const revientalabocina = document.querySelector(".revientalabocina")
  // revientalabocina.addEventListener("click", () => {
  //   currentVol = 1
  //   sound.volume(currentVol);
  // })

} catch (error) {
  // console.log(error)
}
