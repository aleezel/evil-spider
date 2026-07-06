import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
  gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

export const scrambleTextJp = () => {
    
    const scrambleTexts = document.querySelectorAll('[data-scrambletextauto]');

    scrambleTexts.forEach((text) => {
        let ogText = text.innerText;
        let attribute = text.getAttribute('data-scrambletextauto');
        text.innerText = '';

        gsap.to(text, {
            scrambleText: {
                text: ogText,
                chars: "国雲女水大北円風地弱時月分遅",
                revealDelay: (attribute == 'intro') ? 3 : 0.5,
                speed: 0.4,
                
            },
            duration: gsap.utils.clamp(3, ogText.length * 0.6, 7) ,
            ease: 'none',
        })

    });
}