import { context, canvas, start, end, btnclear } from "../canvas/canvas.js";

const img = new Image()
img.src = "../floodfill/Exemplo.bmp"

img.onload = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
};

alert("No modo preenchimento basta selecionar uma parte branca para preencher o resto, como o balde do paint, no modo marcação de vertices você pode delimitar oque quer pintar, porem nesse caso aperte o botão completar");

const btnconect = document.getElementById("conect")
const btnpaint = document.getElementById("paint")

let boundBox = {
    vertex: [],
    edge: [],
    sides: [],
    limits: {
        min: {x: 0, y: 0},
        max: {x: 0, y: 0}
    }
}

let polygon = {
    vertex: [],
    edge: [],
    sides: []
}

let polygonPointsFlag = true
let polygonDrawFlag = false

const popData = (data) =>{
    while(data.length){
        data.pop()
    }
}

const getPolygonVertex = (x,y) =>{
    context.fillStyle = "RGB(255,0,0)";
    context.fillRect(x, y, 5, 5);
    polygon.vertex.push([x,y]);
}

const setPolygonLimits = () =>{
    boundBox.limits.max.x = boundBox.limits.max.y = Number.MIN_SAFE_INTEGER
    boundBox.limits.min.x = boundBox.limits.min.y = Number.MAX_SAFE_INTEGER
    for(let i=0;i<polygon.vertex.length;i++){
        if(boundBox.limits.max.x < polygon.vertex[i][0]){
            boundBox.limits.max.x = polygon.vertex[i][0]
        } 
        if(boundBox.limits.min.x > polygon.vertex[i][0]){
            boundBox.limits.min.x = polygon.vertex[i][0]
        }
        if(boundBox.limits.max.y < polygon.vertex[i][1]){
            boundBox.limits.max.y = polygon.vertex[i][1]
        }
        if(boundBox.limits.min.y > polygon.vertex[i][1]){
            boundBox.limits.min.y = polygon.vertex[i][1]
        }
    }

    boundBox.vertex.push([boundBox.limits.min.x,boundBox.limits.min.y])
    boundBox.vertex.push([boundBox.limits.max.x,boundBox.limits.min.y])
    boundBox.vertex.push([boundBox.limits.max.x,boundBox.limits.max.y])
    boundBox.vertex.push([boundBox.limits.min.x,boundBox.limits.max.y])

    boundBox.edge.push([0,1])
    boundBox.edge.push([1,2])
    boundBox.edge.push([2,3])
    boundBox.edge.push([3,0])
        
    context.strokeStyle = "#e65300"
    drawBoundBox(boundBox.limits.min.x,boundBox.limits.min.y,boundBox.limits.max.x,boundBox.limits.max.y)
}

const drawBoundBox = (x0, y0, x1, y1) => {
    context.strokeStyle = "RGBA(0, 0, 0, 0)";
    context.fillStyle = "RGBA(0, 0, 0, 0)";
    context.beginPath();
    context.rect(x0, y0, Math.abs(x1 - x0), Math.abs(y1 - y0));
    context.fill();
    context.stroke();
    InitBoundBoxCode();
};

const drawPolygon = () => {
    context.strokeStyle = "RGB(255, 0, 0)";
    context.fillStyle = "RGB(255, 0, 0)"; 

    context.beginPath();
    context.moveTo(polygon.vertex[0][0], polygon.vertex[0][1]);

    for (let i = 1; i < polygon.vertex.length; i++) {
        context.lineTo(polygon.vertex[i][0], polygon.vertex[i][1]);
        polygon.edge.push([i - 1, i]);
    }

    context.lineTo(polygon.vertex[0][0], polygon.vertex[0][1]);
    polygon.edge.push([polygon.vertex.length - 1, 0]);

    context.fill();
    context.stroke();

    setPolygonLimits();
};

const getRGBForCoord = (x, y) => {
    let pixel = context.getImageData(x,y, 1, 1)
    return [pixel.data[0],pixel.data[1],pixel.data[2]] 
}


const paintPolygon = () =>{
    context.fillStyle = "RGB(255,0,0)"
    let limx = Math.abs(boundBox.limits.max.x-boundBox.limits.min.x)
    let limy = Math.abs(boundBox.limits.max.y-boundBox.limits.min.y)   
    for (let i = 0; i <limx;i++) {
        for (let j = 0; j<limy; j++) {
          if(boundBox.sides[i][j]==1){
            context.fillRect(i + boundBox.limits.min.x, j + boundBox.limits.min.y, 1, 1)
          }
        }
      }    
}

const invertColors = (point,boundBox) => {
    for(let i=Math.abs(parseInt(point.x)-boundBox.limits.min.x);i<Math.abs(boundBox.limits.max.x-boundBox.limits.min.x);i++){
        if(boundBox.sides[i][parseInt(point.y)-boundBox.limits.min.y] == 1){
            boundBox.sides[i][parseInt(point.y)-boundBox.limits.min.y] = 0
        }else{
            boundBox.sides[i][parseInt(point.y)-boundBox.limits.min.y] = 1
        }
    }
}

const InitBoundBoxCode = () =>{
    let limx = Math.abs(boundBox.limits.max.x-boundBox.limits.min.x)
    let limy = Math.abs(boundBox.limits.max.y-boundBox.limits.min.y)
    for(let i=0;i<limx;i++){
        boundBox.sides[i] = []
        for(let j=0;j<limy;j++){
            boundBox.sides[i].push(0)
        }
    }    
}

const detectWallsAndFill = (x, y) => {
    const stack = [[x, y]];
    const visited = new Set();
    const wallColor = [0, 0, 0];
    const fillColor = [255, 0, 0];

    const isSameColor = (color1, color2) =>
        color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];

    const getKey = (x, y) => `${x},${y}`;

    while (stack.length > 0) {
        const [cx, cy] = stack.pop();

        if (visited.has(getKey(cx, cy))) continue;

        visited.add(getKey(cx, cy));

        const currentColor = getRGBForCoord(cx, cy);

        if (isSameColor(currentColor, wallColor)) {
            if (!polygon.vertex.some(([vx, vy]) => vx === cx && vy === cy)) {
                polygon.vertex.push([cx, cy]);
            }
            continue;
        }

        if (!isSameColor(currentColor, fillColor)) {
            context.fillStyle = `rgb(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]})`;
            context.fillRect(cx, cy, 1, 1);

            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }
    }
};


btnconect.addEventListener("click", (e) => {
    if (!(polygon.vertex.length > 2)) {
        alert("Selecione três pontos no mínimo por favor");
        return;
    }
    if (!polygonDrawFlag) {
        drawPolygon();
        polygonDrawFlag = true;

        drawBoundBox(
            boundBox.limits.min.x,
            boundBox.limits.min.y,
            boundBox.limits.max.x,
            boundBox.limits.max.y
        );
    }
});

btnclear.addEventListener("click", (e) => {
    // Limpar todos os dados e redefinir os estados
    popData(polygon.vertex);
    popData(polygon.edge);
    popData(polygon.sides);
    popData(boundBox.vertex);
    popData(boundBox.edge);
    popData(boundBox.sides);
    boundBox.limits.min.x = 0;
    boundBox.limits.min.y = 0;
    boundBox.limits.max.x = 0;
    boundBox.limits.max.y = 0;
    polygonDrawFlag = false;

    // Redesenhar o fundo com branco e recarregar a imagem
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
});


canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (fillMode) {
        detectWallsAndFill(x, y);
    } else {
        if (polygonPointsFlag && !polygonDrawFlag) {
            getPolygonVertex(x, y);
        }
    }
});


let fillMode = false;

btnpaint.addEventListener("click", (e) => {
    fillMode = !fillMode;
    if (fillMode) {
        btnpaint.textContent = "Modo Preenchimento";
    } else {
        btnpaint.textContent = "Modo Marcação de Vértices";
    }
});
