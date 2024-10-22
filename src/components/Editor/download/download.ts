import { bytesToBase64 } from "@/utils/convert";
import { buildSvgFragment } from "./svgFragment";

export async function download(
  editorCanvas: HTMLCanvasElement,
  fragment: string,
  fonts: string[],
) {
  const textEditorCanvas = await buildTextEditorCanvas(
    fragment,
    editorCanvas.width,
    editorCanvas.height,
    fonts,
  );

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw Error("Canvas 2d context is not available");
  }

  canvas.width = editorCanvas.width;
  canvas.height = editorCanvas.height;

  context.drawImage(editorCanvas, 0, 0);
  context.drawImage(
    textEditorCanvas,
    0,
    0,
    editorCanvas.width,
    editorCanvas.height,
  );

  canvas.toBlob(
    (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    "image/png",
    1,
  );
}

export async function buildTextEditorCanvas(
  fragment: string,
  width: number,
  height: number,
  fonts: string[],
): Promise<HTMLCanvasElement> {
  const svgFragment = await buildSvgFragment(fragment, 800, 600, fonts);

  return new Promise((resolve, reject) => {
    const bytes = new TextEncoder().encode(svgFragment);
    const source = "data:image/svg+xml;base64," + bytesToBase64(bytes);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw Error("Canvas 2d context is not available");
    }

    canvas.width = width;
    canvas.height = height;

    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas);
    };

    image.onerror = (error) => {
      reject(error);
    };

    image.src = source;
  });
}
