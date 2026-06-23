import { gsap } from "gsap";
import "@lottiefiles/lottie-player";

export const preloader = () => {
    window.addEventListener("load", function () {
        const preloader = document.getElementsByClassName('preloader')

        gsap.to(preloader, {
            onStart: console.log("hola"),
            delay: 3,
            duration: 1,
            autoAlpha: 0,
        })
    })
}