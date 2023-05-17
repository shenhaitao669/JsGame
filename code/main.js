const pen = document.getElementById("surface").getContext("2d");

const eventMap = {};

addEventListener("keydown", (e) => {
    eventMap[e.code] = true;
});

addEventListener("keyup", (e) => {
    delete eventMap[e.code];
});

const interactive = () => {
};

const compute = () => {
};

const animation1 = new Animation(128 / 2, 128 / 2, 128, 128, "res/blue_fire.png");
const animation2 = new Animation(128 / 2, 128 / 2, 128, 128, "res/fire_attack.png");
const animation3 = new Animation(128 / 2, 128 / 2, 128, 128, "res/sword_attack.png");
const animation4 = new Animation(256 / 2, 512 / 2, 256, 512, "res/fire_burn.png");
const animation6 = new Animation(128, 256, 128, 256, "res/fire_burn2.png");
const animation7 = new Animation(144, 192, 144, 192, "res/ice_attack.png");
const animation8 = new Animation(64, 104, 64, 110, "res/person_move.png");
const onLoopEnd = [
    () => animation8.setFrameRange(1, 1 + 6).loop(parseInt(Math.random() * 10) + 1).onLoopEnded(() => onLoopEnd[1]()),
    () => animation8.setFrameRange(8, 8 + 6).loop(parseInt(Math.random() * 10) + 1).onLoopEnded(() => onLoopEnd[0]())
];
animation8.onLoaded(() => onLoopEnd[0]());

const render = () => {
    pen.fillStyle = "#000";
    pen.fillRect(0, 0, 800, 600);

    animation1.play(pen, 0, 0);
    animation2.play(pen, 0, 64);
    animation3.play(pen, 0, 128);
    animation4.play(pen, 0, 192);
    animation6.play(pen, 128, 0);
    animation7.play(pen, 128, 256);
    animation8.play(pen, 256, 0);
    
    requestAnimationFrame(render);
};
requestAnimationFrame(render);