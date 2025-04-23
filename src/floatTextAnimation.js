let textSplit = new splitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
});

let flyingText = document.querySelectorAll("[flying-text]")

flyingText.forEach(function (index) {
    let tl = gsap.timeline ({paused: true})
})
