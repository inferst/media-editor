import {
  isContrastData,
  isFadeData,
  isGrainData,
  isHighlightsData,
  isOffscreenData,
  isSaturationData,
  isShadowsData,
  isVignetteData,
  isWarmthData,
  OffscreenData,
} from "../types/types";
import BASE_FRAGMENT_SHADER from "./shaders/frag.glsl?raw";
import BASE_VERTEX_SHADER from "./shaders/vert.glsl?raw";

let canvas;
let gl: WebGLRenderingContext | null;

let contrastLoc: WebGLUniformLocation | null;
let warmthLoc: WebGLUniformLocation | null;
let grainLoc: WebGLUniformLocation | null;
let highlightsLoc: WebGLUniformLocation | null;
let shadowsLoc: WebGLUniformLocation | null;
let fadeAmountLoc: WebGLUniformLocation | null;
let vignetteLoc: WebGLUniformLocation | null;
let saturationLoc: WebGLUniformLocation | null;

const drawImage = async (imageBitmap: ImageBitmap) => {
  if (!gl) {
    return;
  }

  // Create a texture
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imageBitmap,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
};

const draw = () => {
  if (gl) {
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
};

const init = async (data: OffscreenData) => {
  // Get our canvas
  canvas = data.canvas;
  gl = canvas.getContext("webgl");

  if (!gl) {
    return;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // Create our vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);

  if (!vertexShader) {
    return;
  }

  gl.shaderSource(vertexShader, BASE_VERTEX_SHADER);
  gl.compileShader(vertexShader);

  // Create our fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!fragmentShader) {
    return;
  }

  gl.shaderSource(fragmentShader, BASE_FRAGMENT_SHADER);
  gl.compileShader(fragmentShader);

  // Create our program
  const program = gl.createProgram();

  if (!program) {
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Enable the program
  gl.useProgram(program);

  contrastLoc = gl.getUniformLocation(program, "contrast");
  warmthLoc = gl.getUniformLocation(program, "warmth");
  // grainLoc = gl.getUniformLocation(program, "grain");
  highlightsLoc = gl.getUniformLocation(program, "highlights");
  shadowsLoc = gl.getUniformLocation(program, "shadows");
  fadeAmountLoc = gl.getUniformLocation(program, "fadeAmount");
  vignetteLoc = gl.getUniformLocation(program, "vignette");
  saturationLoc = gl.getUniformLocation(program, "saturation");

  gl.uniform1f(contrastLoc, 1);
  gl.uniform1f(saturationLoc, 1);
  gl.uniform1f(shadowsLoc, 1);
  gl.uniform1f(highlightsLoc, 1);

  // Bind VERTICES as the active array buffer.
  const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

  // Set and enable our array buffer as the program's "position" variable
  const positionLocation = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  await drawImage(data.bitmap);

  draw();
};

addEventListener("message", async (event: MessageEvent) => {
  const { data } = event;

  if (isOffscreenData(data)) {
    init(data);
  } else if (gl) {
    if (isVignetteData(data)) {
      if (vignetteLoc) {
        gl.uniform1f(vignetteLoc, data.vignette);
        draw();
      }
    }
    if (isWarmthData(data)) {
      if (warmthLoc) {
        gl.uniform1f(warmthLoc, data.warmth);
        draw();
      }
    }
    if (isGrainData(data)) {
      if (grainLoc) {
        gl.uniform1f(grainLoc, data.grain);
        draw();
      }
    }
    if (isHighlightsData(data)) {
      if (highlightsLoc) {
        gl.uniform1f(highlightsLoc, data.highlights);
        draw();
      }
    }
    if (isShadowsData(data)) {
      if (shadowsLoc) {
        gl.uniform1f(shadowsLoc, data.shadows);
        draw();
      }
    }
    if (isFadeData(data)) {
      if (fadeAmountLoc) {
        gl.uniform1f(fadeAmountLoc, data.fade);
        draw();
      }
    }
    if (isContrastData(data)) {
      if (contrastLoc) {
        gl.uniform1f(contrastLoc, data.contrast);
        draw();
      }
    }
    if (isSaturationData(data)) {
      if (saturationLoc) {
        gl.uniform1f(saturationLoc, data.saturation);
        draw();
      }
    }
  }
});
