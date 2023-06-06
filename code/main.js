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

const map = new Map();

const render = () => {
    pen.fillStyle = "#fff";
    pen.fillRect(0, 0, 800, 600);

    map.play(pen, 0, 0);

    requestAnimationFrame(render);
};
requestAnimationFrame(render);