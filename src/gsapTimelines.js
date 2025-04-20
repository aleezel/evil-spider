import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import SplitType from 'split-type';


gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const gsapTimelines = () => {
    // // console.log("gsapTimelines")
    //cursor
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });
    gsap.set(".cursor-feedback", { autoAlpha: 0 });

    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.5, ease: "back(1.2)" }),
        yTo = gsap.quickTo(".cursor", "y", { duration: 0.5, ease: "back(1.2)" });

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
    }, { passive: true });

    //text split
    let flyingText = new SplitType("[flying-text]", { types: "chars" })



    //vars
    const kwords = document.querySelectorAll(".div-keyword");

    //ABSOLUTE SETS
    gsap.set('.div-keyword', { autoAlpha: 0 })


    // Seleccionamos todos los textos secuenciales y palabras clave
    const introTexts = gsap.utils.toArray(".div-introtext")
    // Aseguramos que todos los textos inicien invisibles y sin desplazamiento
    gsap.set(introTexts, {
        xPercent: -50, // centrado horizontal
        yPercent: 60,  // empiezan desde abajo
        autoAlpha: 0   // incluye opacity y visibility: hidden
    })

    const eyebrow = document.querySelector(".div-text.hero-head_eyebrow");
    // gsap.set('.div-text.hero-head_eyebrow', { y: "50vh", autoAlpha: 0 })
    gsap.set(eyebrow, { yPercent: 60, autoAlpha: 0 });

    let heroSecTl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.spider-sticky',
            pin: true,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '+=5000', // end after scrolling 500px beyond the start
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            markers: true,
            refreshPriority: 2
        }
    });

    heroSecTl.addLabel('intro')
        .from('.spider-sticky', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 10 }, 0)
        .to('.cursor-feedback', { autoAlpha: 1 }, 0)
        .to('.cursor-feedback', { autoAlpha: 0 }, 5)

    // Animaciones secuenciales: entrada → centro → salida
    introTexts.forEach((textEl, i) => {
        heroSecTl
            .to(textEl, {
                yPercent: -50, // llega al centro vertical
                autoAlpha: 1,
                duration: 1
            })
            .to(textEl, {
                yPercent: -150, // sale hacia arriba
                autoAlpha: 0,
                duration: 1
            }, "+=1") // espera 1s visible en centro antes de salir
    })

    heroSecTl

        .to(eyebrow, { yPercent: 0, autoAlpha: 1, duration: 1 })
        .to(eyebrow, { yPercent: -100, duration: 1 })

        .from('.div-keyword', { autoAlpha: 0 })
        .to(kwords, { autoAlpha: 1, stagger: { each: 0.2, from: "random" } })
        .from('.spider-texture-wrap', { opacity: 0 })
        .from('.spider-heading', { opacity: 0 })

        .from('.hero_spline', { opacity: 0 })
        .from('.main-text', { opacity: 0 })
        .from('.color-overlay', { opacity: 0 }, ">-0.5")

        .addLabel('end');


    let chapter1Tl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.chapter-i-wrap',
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '+=5000', // end after scrolling 500px beyond the start
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
            markers: { startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20 },
            id: 2,
        }
    });

    chapter1Tl.set(flyingText.chars, { y: '60vh' })
        .set('.head-chars-wrap', { rotation: 90 })
        .to('.head-chars-wrap', { rotation: -60, ease: 'power4' }, 0)
        .to(flyingText.chars, { y: '-10svh', ease: 'power4', stagger: 0.5 }, 0)
    //.from('.chapter-I-wrap', { backgroundImage: "linear-gradient(#AB074F, #8F1E73)", duration: 20 }, 0)


}
