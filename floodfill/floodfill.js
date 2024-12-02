import { context, canvas, start, end, btnclear } from "../canvas/canvas.js";
import "./floodfill.min.js"

const img = new Image()
img.src = "../floodfill/Exemplo.bmp"

img.onload = () => {
    context.drawImage(img, 0,0)
    const ImageData = context.getImageData(0, 0, canvas.width, canvas.height)
}

const getRGBForCoord = (x, y) => {
    let pixel = context.getImageData(x,y, 1, 1)
    return [pixel.data[0],pixel.data[1],pixel.data[2]] 
}

const colorsMatch = (pixel, color) => {
   if(pixel[0] === color[0] && pixel[1] === color[1] && pixel[2] === color[2]) return true
   return false
}
 

const floodfill4 = (x,y) => {

    context.strokeStyle = "RGB(255,0,0)"
    context.beginPath()
    context.rect(x,y,1,1)
    context.stroke() 

    let pixel = getRGBForCoord(x+1,y)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill4(x+1,y)
    }

    pixel = getRGBForCoord(x-1,y)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill4(x-1,y)
    }

    pixel = getRGBForCoord(x,y+1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill4(x,y+1)
    }

    pixel = getRGBForCoord(x,y-1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill4(x,y-1)
    }
}

const floodfill8 = (x,y) => {

    context.strokeStyle = "RGB(255,0,0)"
    context.beginPath()
    context.rect(x,y,1,1)
    context.stroke() 

    let pixel = getRGBForCoord(x+1,y)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x+1,y)
    }

    pixel = getRGBForCoord(x+1,y+1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x+1,y+1)
    }

    pixel = getRGBForCoord(x-1,y+1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x-1,y+1)
    }

    pixel = getRGBForCoord(x-1,y-1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x-1,y-1)
    }

    pixel = getRGBForCoord(x+1,y-1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x+1,y-1)
    }

    pixel = getRGBForCoord(x-1,y)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x-1,y)
    }

    pixel = getRGBForCoord(x,y+1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x,y+1)
    }

    pixel = getRGBForCoord(x,y-1)
    if(!colorsMatch(pixel,[0,0,0]) && !colorsMatch(pixel,[255,0,0])){
        floodfill8(x,y-1)
    }
}

let confirm8 = false;
const btnToggle = document.getElementById("btn-tg");

btnToggle.addEventListener("click", () => {
    confirm8 = !confirm8;
    alert(`Modo de preenchimento: ${confirm8 ? "8-direções" : "4-direções"}`);
});

canvas.addEventListener("click", e => {
    img.onload()
    context.fillStyle = "rgba(255,0,0,1.0)";
    if (confirm8 == false) {
    context.fillFlood(start[0],start[1], 4)
    }
    if (confirm8 == true)
    {
        fillFlood(start[0],start[1], 8)
    }
})

btnclear.addEventListener("click", e => {
    img.onload()
})

