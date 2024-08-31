import {
  isContrastData,
  isFadeData,
  isGrainData,
  isHighlightsData,
  isOffscreenData,
  isSaturationData,
  isShadowsData,
  isSharpenData,
  isVignetteData,
  isWarmthData,
  OffscreenData,
} from "../types/types";

import toolFragShader from "./shaders/tool/frag.glsl?raw";
import toolVertShader from "./shaders/tool/vert.glsl?raw";

import sharpenFragShader from "./shaders/sharpen/frag.glsl?raw";
import sharpenVertShader from "./shaders/sharpen/vert.glsl?raw";

let canvas;
let gl: WebGLRenderingContext | null;

type UniformLocation =
  | "contrast"
  | "warmth"
  | "grain"
  | "highlights"
  | "shadows"
  | "fade"
  | "vignette"
  | "saturation"
  | "width"
  | "height"
  | "sharpen";

type UniformLocations = {
  [key in UniformLocation]?: WebGLUniformLocation;
};

const locations: UniformLocations = {};

const setLocation = (name: UniformLocation, program: WebGLProgram) => {
  if (gl) {
    const location = gl.getUniformLocation(program, name);

    if (location == null) {
      throw Error(`UniformLocation ${name} is null`);
    }

    locations[name] = location;
  }
};

const setUniform = (name: UniformLocation, value: number) => {
  if (gl) {
    const location = locations[name];

    if (location) {
      gl.uniform1f(location, value);
    }
  }
};

const updateUniform = (name: UniformLocation, value: number) => {
  setUniform(name, value);
  draw();
};

const draw = () => {
  if (gl) {
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
};

const initImage = async (imageBitmap: ImageBitmap) => {
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

  setUniform("width", imageBitmap.width);
  setUniform("height", imageBitmap.width);
};

const initToolShaders = () => {
  if (!gl) {
    return;
  }

  // Create our program
  const program = gl.createProgram();

  if (!program) {
    return;
  }

  // Create our vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);

  if (!vertexShader) {
    return;
  }

  gl.shaderSource(vertexShader, toolVertShader);
  gl.compileShader(vertexShader);

  // Create our fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!fragmentShader) {
    return;
  }

  gl.shaderSource(fragmentShader, toolFragShader);
  gl.compileShader(fragmentShader);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  // Enable the program
  gl.useProgram(program);

  setLocation("contrast", program);
  setLocation("warmth", program);
  setLocation("highlights", program);
  setLocation("shadows", program);
  setLocation("fade", program);
  setLocation("vignette", program);
  setLocation("saturation", program);
  setLocation("grain", program);

  setLocation("width", program);
  setLocation("height", program);

  setUniform("contrast", 1);
  setUniform("saturation", 1);
  setUniform("shadows", 1);
  setUniform("highlights", 1);

  // Bind VERTICES as the active array buffer.
  const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

  // Set and enable our array buffer as the program's "position" variable
  const positionLocation = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
};

const initSharpenShaders = (program: WebGLProgram) => {
  if (!gl) {
    return;
  }

  // Create our program
  const program = gl.createProgram();

  if (!program) {
    return;
  }

  // Create our vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);

  if (!vertexShader) {
    return;
  }

  gl.shaderSource(vertexShader, sharpenVertShader);
  gl.compileShader(vertexShader);

  // Create our fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!fragmentShader) {
    return;
  }

  gl.shaderSource(fragmentShader, sharpenFragShader);
  gl.compileShader(fragmentShader);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
};

const init = async (data: OffscreenData) => {
  // Get our canvas
  canvas = data.canvas;
  gl = canvas.getContext("webgl");

  if (!gl) {
    return;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  initToolShaders();
  // initSharpenShaders(program);

  await initImage(data.bitmap);
  draw();
};

addEventListener("message", async (event: MessageEvent) => {
  const { data } = event;

  if (isOffscreenData(data)) {
    init(data);
  } else if (gl) {
    if (isVignetteData(data)) {
      updateUniform("vignette", data.vignette);
    }
    if (isWarmthData(data)) {
      updateUniform("warmth", data.warmth);
    }
    if (isGrainData(data)) {
      updateUniform("grain", data.grain);
    }
    if (isHighlightsData(data)) {
      updateUniform("highlights", data.highlights);
    }
    if (isShadowsData(data)) {
      updateUniform("shadows", data.shadows);
    }
    if (isFadeData(data)) {
      updateUniform("fade", data.fade);
    }
    if (isContrastData(data)) {
      updateUniform("contrast", data.contrast);
    }
    if (isSaturationData(data)) {
      updateUniform("saturation", data.saturation);
    }
    if (isSharpenData(data)) {
      updateUniform("sharpen", data.sharpen);
    }
  }
});
