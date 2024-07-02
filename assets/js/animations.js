import * as rive from "@rive-app/canvas";
if (document.getElementById('sample-canvas')) {

    console.log('animation.js loaded!!')
    const animation = new rive.Rive({
        src: 'assets/main_stroke.riv',
        canvas: document.getElementById('sample-canvas'),
        autoplay: true,
        animations: ['brush']
    })


    animation.on('load', () => {
    // only added animations can be scrubbed.
    animation.pause(['brush'])
    animation.scrub(['brush'], 0)

    document.getElementsByTagName('body')[0].onscroll = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrub = 1 * (window.scrollY / totalScroll).toFixed(3)
    const scrubModifier = 3;
    animation.scrub('brush', scrub * scrubModifier)
    }
})
}