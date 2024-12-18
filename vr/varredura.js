import { context, canvas, start, end, btnclear } from "../canvas/canvas.js";

let flagMousedown = false;
let object = [];
let projectionObject = [];

const getCursorPosition = (e) => [
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
];

const drawCanvasDivision = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
};

drawCanvasDivision();

alert("Por favor, desenhe no lado esquerdo da divisa.");

const popData = (data) => {
    while (data.length) {
        data.pop();
    }
};

const drawCircle = (start, end) => {
    let radius = Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
    );

    let increment = radius >= 1 ? 1 / radius : 1;

    for (let i = 0; i < 360; i = i + increment * 5) {
        projectionObject.push({
            x: radius * Math.cos(i) + start[0],
            y: start[1],
            z: radius * Math.sin(i) + start[1],
        });
    }
};

const drawObject = () => {
    projectionObject = [];

    object.forEach((element) => {
        drawCircle(
            [0, Math.abs(element[1] - canvas.height / 2)],
            [
                Math.abs(element[0] - canvas.height / 2),
                Math.abs(element[1] - canvas.height / 2),
            ]
        );
    });

    let projResult = cavaleira(projectionObject);

    projResult.forEach((element) => {
        element.x += canvas.width / 2;
        context.fillRect(element.x, element.y, 1, 1);
    });
};

const multiplyMatrices = (point, t) => {
    let result = [];
    for (let i = 0; i < t[0].length; i++) {
        result[i] = 0;
        for (let j = 0; j < t.length; j++) {
            if (point[j] === undefined) point[j] = 0;
            result[i] += point[j] * t[j][i];
        }
    }
    return result;
};

const cavaleira = (points) => {
    let newPoints = [];

    let t = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [Math.cos(45), Math.sin(45), 0, 0],
        [0, 0, 0, 1],
    ];

    for (let i = 0; i < points.length; i++) {
        let result = multiplyMatrices([points[i].x, points[i].y, points[i].z, 1], t);
        newPoints.push({ x: parseInt(result[0]), y: parseInt(result[1]) });
    }
    return newPoints;
};

canvas.addEventListener("mousedown", (e) => {
    flagMousedown = true;
});

canvas.addEventListener("mouseup", (e) => {
    flagMousedown = false;
    drawObject();
});

canvas.addEventListener("mousemove", (e) => {
    if (flagMousedown) {
        let point = getCursorPosition(e);
        object.push(point);
        context.fillRect(point[0], point[1], 1, 1);
    }
});

btnclear.addEventListener("click", (e) => {
    popData(object);
    popData(projectionObject);
    drawCanvasDivision();
});
