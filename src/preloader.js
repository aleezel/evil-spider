import { gsap } from "gsap";
import { DotLottie } from "@lottiefiles/dotlottie-web";

export const preloader = () => {
        const preloader = document.getElementsByClassName('preloader')
        const icons = document.querySelectorAll("#lottie-preloader")

        icons.forEach((icon) => {
            const color = icon.getAttribute("data-color");
            const preloaderLotties = new DotLottie({
                autoplay: true,
                loop: false,
                canvas: icon,
                src: `src/assets/preloader_${color}_icon.json`
            })
        })

        gsap.to(preloader, {
            delay: 3,
            duration: 1,
            autoAlpha: 0,
        })
}