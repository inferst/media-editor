import { applyContrast } from "../filters/contrast";

let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D | null;
let imageData: ImageData | undefined;

function applyBrightness(
  data: Uint8ClampedArray,
  brightness: number,
): Uint8ClampedArray {
  const factor = brightness / 100;
  const result = new Uint8ClampedArray(data);
  for (let i = 0; i < data.length; i += 4) {
    result[i] *= factor;
    result[i + 1] *= factor;
    result[i + 2] *= factor;
  }

  return result;
}

let timer: number;

const processContrast = (value: number) => {
  if (timer) {
    console.log("clear timer");
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    if (imageData) {
      const data = new Uint8ClampedArray(imageData.data);
      applyContrast(value, data);
      const newImageData = new ImageData(
        data,
        imageData.width,
        imageData.height,
      );
      context?.putImageData(newImageData, 0, 0);
    }
  }, 5);
};

const processBrightness = (value: number) => {
  if (timer) {
    console.log("clear timer");
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (imageData) {
      const newData = applyBrightness(imageData.data, value);
      const newImageData = new ImageData(
        newData,
        imageData.width,
        imageData.height,
      );
      context?.putImageData(newImageData, 0, 0);
    }
  }, 5);
};

addEventListener("message", ({ data }) => {
  let prev = performance.now();
  const renderFPS = () => {
    const now = performance.now();
    const fps = (1 / (now - prev)) * 1000;
    prev = now;

    if (context) {
      context.fillStyle = "orange";
      context.font = "30px Tahoma";
      context.clearRect(0, 0, 75, 45);
      context.fillText(Math.floor(fps).toString(), 10, 30);
    }

    requestAnimationFrame(renderFPS);
  };

  const loadImage = () => {
    fetch("/image2.jpg")
      .then((data) => data.blob())
      .then((blob) => {
        createImageBitmap(blob).then((img) => {
          if (context) {
            context.drawImage(img, 0, 0);
            imageData = context.getImageData(0, 0, img.width, img.height);
          }
        });
      });
  };

  if (data.offscreen) {
    canvas = data.offscreen as OffscreenCanvas;
    context = canvas.getContext("2d");
    renderFPS();
    loadImage();
  }

  if (data.event == "brightness") {
    processBrightness(data.value);
  }

  if (data.event == "contrast") {
    processContrast(data.value);
  }
});
