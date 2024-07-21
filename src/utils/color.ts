// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/ColorPicker/converters/converters.ts
// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/ColorPicker/converters/parsers.ts

export type HsvObject = {
  h: number;
  s: number;
  v: number;
};

export type RgbObject = {
  r: number;
  g: number;
  b: number;
};

export type Hex = string;

export function round(number: number, digits = 0, base = 10 ** digits) {
  return Math.round(base * number) / base;
}

export const hsvEquals = (hsv1: HsvObject, hsv2: HsvObject) => {
  return hsv1.h == hsv2.h && hsv1.s == hsv2.s && hsv1.v == hsv2.v;
};

export const rgbToObject = (str: string): RgbObject => {
  const rgb = str.split(",").filter(Boolean).map(Number);
  return {
    r: rgb[0] ?? 0,
    g: rgb[1] ?? 0,
    b: rgb[2] ?? 0,
  };
};

export const hsvToHex = (hsv: HsvObject): Hex => {
  const rgb = hsvToRgb(hsv);
  return rgbToHex(rgb);
};

export const hexToHsv = (hex: string): HsvObject => {
  const rgb = hexToRgb(hex);
  return rgbToHsv(rgb);
};

export function hsvToRgb(hsv: HsvObject): RgbObject {
  const { h, s, v } = hsv;

  const _h = (h / 360) * 6;
  const _s = s / 100;
  const _v = v / 100;

  const hh = Math.floor(_h);
  const l = _v * (1 - _s);
  const c = _v * (1 - (_h - hh) * _s);
  const d = _v * (1 - (1 - _h + hh) * _s);
  const module = hh % 6;

  return {
    r: Math.round([_v, c, l, l, d, _v][module] * 255),
    g: Math.round([d, _v, _v, c, l, l][module] * 255),
    b: Math.round([l, l, d, _v, _v, c][module] * 255),
  };
}

export const rgbToHsv = (rgb: RgbObject): HsvObject => {
  const { r, g, b } = rgb;

  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh), 3),
    s: round(max ? (delta / max) * 100 : 0, 3),
    v: round((max / 255) * 100, 3),
  };
};

// https://css-tricks.com/converting-color-spaces-in-javascript/

export const rgbToHex = (rgb: RgbObject) => {
  let r = rgb.r.toString(16);
  let g = rgb.g.toString(16);
  let b = rgb.b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};

export const hexToRgb = (hex: Hex): RgbObject => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length == 4) {
    r = parseInt("0x" + hex[1] + hex[1], 16);
    g = parseInt("0x" + hex[2] + hex[2], 16);
    b = parseInt("0x" + hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    r = parseInt("0x" + hex[1] + hex[2], 16);
    g = parseInt("0x" + hex[3] + hex[4], 16);
    b = parseInt("0x" + hex[5] + hex[6], 16);
  }

  return { r, g, b };
};
