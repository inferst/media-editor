import {
  isContrastData,
  isEnhanceData,
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

import enhanceFragShader from "./shaders/enhance/frag.glsl?raw";
import enhanceVertShader from "./shaders/enhance/vert.glsl?raw";

let canvas;
let gl: WebGLRenderingContext | null;

let toolContrastLocation: WebGLUniformLocation | null;
let toolWarmthLocation: WebGLUniformLocation | null;
let toolGrainLocation: WebGLUniformLocation | null;
let toolHighlightsLocation: WebGLUniformLocation | null;
let toolShadowsLocation: WebGLUniformLocation | null;
let toolFadeLocation: WebGLUniformLocation | null;
let toolVignetteLocation: WebGLUniformLocation | null;
let toolSaturationLocation: WebGLUniformLocation | null;
let toolWidthLocation: WebGLUniformLocation | null;
let toolHeightLocation: WebGLUniformLocation | null;

// let sharpenLocation: WebGLUniformLocation | null;

let enhanceIntensityLocation: WebGLUniformLocation | null;
let enhanceSTextureLocation: WebGLUniformLocation | null;
let enhanceInputImageTexture2Location: WebGLUniformLocation | null;
let enhanceWidthLocation: WebGLUniformLocation | null;
let enhanceHeightLocation: WebGLUniformLocation | null;

let toolProgram: WebGLProgram | null;
let enhanceProgram: WebGLProgram | null;

// type UniformLocation =
//   | "contrast"
//   | "warmth"
//   | "grain"
//   | "highlights"
//   | "shadows"
//   | "fade"
//   | "vignette"
//   | "saturation"
//   | "width"
//   | "height"
//   | "sharpen"
//   | "intensity"
//   | "sTexture"
//   | "inputImageTexture2";
//
// type UniformLocations = {
//   [key in UniformLocation]?: WebGLUniformLocation;
// };
//
// type ProgramLocations = {
//   program: WebGLProgram;
//   locations: UniformLocations;
// };
//
// const locations: ProgramLocations[] = [];
//
// const setLocation = (name: UniformLocation, program: WebGLProgram) => {
//   if (gl) {
//     const location = gl.getUniformLocation(program, name);
//
//     if (location == null) {
//       throw Error(`UniformLocation ${name} is null`);
//     }
//
//     const found = locations.find((location) => location.program == program);
//
//     if (found) {
//       found.locations[name] = location;
//     } else {
//       locations.push({
//         program,
//         locations: { [name]: location },
//       });
//     }
//   }
// };

// const setUniform = (
//   name: UniformLocation,
//   value: number,
//   type: "float" | "int" = "float",
// ) => {
//   if (gl) {
//     for (const loc of locations) {
//       const location = loc.locations[name];
//
//       if (location) {
//         if (type == "float") {
//           gl.uniform1f(location, value);
//         } else if (type == "int") {
//           gl.uniform1i(location, value);
//         }
//       }
//     }
//   }
// };

// const updateUniform = (name: UniformLocation, value: number) => {
//   setUniform(name, value);
//   draw();
// };

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
};

const initToolShaders = (imageBitmap: ImageBitmap) => {
  if (!gl) {
    return;
  }

  // Create our program
  toolProgram = gl.createProgram();

  if (!toolProgram) {
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

  gl.attachShader(toolProgram, vertexShader);
  gl.attachShader(toolProgram, fragmentShader);

  gl.linkProgram(toolProgram);

  // Enable the program
  gl.useProgram(toolProgram);

  toolContrastLocation = gl.getUniformLocation(toolProgram, "contrast");
  toolWarmthLocation = gl.getUniformLocation(toolProgram, "warmth");
  toolHighlightsLocation = gl.getUniformLocation(toolProgram, "highlights");
  toolShadowsLocation = gl.getUniformLocation(toolProgram, "shadows");
  toolFadeLocation = gl.getUniformLocation(toolProgram, "fade");
  toolVignetteLocation = gl.getUniformLocation(toolProgram, "vignette");
  toolSaturationLocation = gl.getUniformLocation(toolProgram, "saturation");
  toolGrainLocation = gl.getUniformLocation(toolProgram, "grain");

  toolWidthLocation = gl.getUniformLocation(toolProgram, "width");
  toolHeightLocation = gl.getUniformLocation(toolProgram, "height");

  gl.uniform1f(toolContrastLocation, 1);
  gl.uniform1f(toolSaturationLocation, 1);
  gl.uniform1f(toolShadowsLocation, 1);
  gl.uniform1f(toolHighlightsLocation, 1);

  gl.uniform1f(toolWidthLocation, imageBitmap.width);
  gl.uniform1f(toolHeightLocation, imageBitmap.height);

  // Bind VERTICES as the active array buffer.
  const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

  // Set and enable our array buffer as the program's "position" variable
  const positionLocation = gl.getAttribLocation(toolProgram, "position");
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initEnhanceShaders = (imageBitmap: ImageBitmap) => {
  if (!gl) {
    return;
  }

  // Create our program
  enhanceProgram = gl.createProgram();

  if (!enhanceProgram) {
    return;
  }

  // Create our vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);

  if (!vertexShader) {
    return;
  }

  gl.shaderSource(vertexShader, enhanceVertShader);
  gl.compileShader(vertexShader);

  // Create our fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!fragmentShader) {
    return;
  }

  gl.shaderSource(fragmentShader, enhanceFragShader);
  gl.compileShader(fragmentShader);

  gl.attachShader(enhanceProgram, vertexShader);
  gl.attachShader(enhanceProgram, fragmentShader);

  gl.linkProgram(enhanceProgram);

  // Enable the program
  gl.useProgram(enhanceProgram);

  enhanceIntensityLocation = gl.getUniformLocation(enhanceProgram, "intensity");
  enhanceSTextureLocation = gl.getUniformLocation(enhanceProgram, "sTexture");
  enhanceInputImageTexture2Location = gl.getUniformLocation(
    enhanceProgram,
    "inputImageTexture2",
  );
  enhanceWidthLocation = gl.getUniformLocation(enhanceProgram, "enhanceWidth");
  enhanceHeightLocation = gl.getUniformLocation(
    enhanceProgram,
    "enhanceHeight",
  );

  gl.uniform1f(enhanceIntensityLocation, 1);
  gl.uniform1i(enhanceSTextureLocation, 0);
  gl.uniform1i(enhanceInputImageTexture2Location, 1);
  gl.uniform1i(enhanceInputImageTexture2Location, 1);

  gl.uniform1f(enhanceWidthLocation, imageBitmap.width);
  gl.uniform1f(enhanceHeightLocation, imageBitmap.height);

  // setLocation("contrast", program);
  // setLocation("warmth", program);
  // setLocation("highlights", program);
  // setLocation("shadows", program);
  // setLocation("fade", program);
  // setLocation("vignette", program);
  // setLocation("saturation", program);
  // setLocation("grain", program);
  //
  // setLocation("width", program);
  // setLocation("height", program);
  //
  // setUniform("contrast", 1);
  // setUniform("saturation", 1);
  // setUniform("shadows", 1);
  // setUniform("highlights", 1);

  // Bind VERTICES as the active array buffer.
  const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

  // Set and enable our array buffer as the program's "position" variable
  const positionLocation = gl.getAttribLocation(enhanceProgram, "position");
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initSharpenShaders = () => {
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

  gl.linkProgram(program);

  // Enable the program
  gl.useProgram(program);

  // setLocation("width", program);
  // setLocation("height", program);

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

const init = async (data: OffscreenData) => {
  // Get our canvas
  canvas = data.canvas;
  gl = canvas.getContext("webgl");

  if (!gl) {
    return;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  initToolShaders(data.bitmap);
  initEnhanceShaders(data.bitmap);
  // initSharpenShaders();

  await initImage(data.bitmap);
  draw();
};

addEventListener("message", async (event: MessageEvent) => {
  const { data } = event;

  if (isOffscreenData(data)) {
    init(data);
  } else if (gl) {
    if (isVignetteData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolVignetteLocation, data.vignette);
    }
    if (isWarmthData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolWarmthLocation, data.warmth);
    }
    if (isGrainData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolGrainLocation, data.grain);
    }
    if (isHighlightsData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolHighlightsLocation, data.highlights);
    }
    if (isShadowsData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolShadowsLocation, data.shadows);
    }
    if (isFadeData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolFadeLocation, data.fade);
    }
    if (isContrastData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolContrastLocation, data.contrast);
    }
    if (isSaturationData(data)) {
      gl.useProgram(toolProgram);
      gl.uniform1f(toolSaturationLocation, data.saturation);
    }
    if (isSharpenData(data)) {
      // gl.uniform1f(sharpenLocation, data.sharpen);
    }
    if (isEnhanceData(data)) {
      gl.useProgram(enhanceProgram);
      gl.uniform1f(enhanceIntensityLocation, data.enhance);
    }

    draw();
  }
});
