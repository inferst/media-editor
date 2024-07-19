// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/ColorPicker/converters/converters.ts
// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/ColorPicker/converters/parsers.ts

export type HSV = {
  h: number;
  s: number;
  v: number;
};

export function round(number: number, digits = 0, base = 10 ** digits) {
  return Math.round(base * number) / base;
}

export const hsvToHex = (hsv: HSV) => {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

export const hexToHsv = (hex: string): HSV => {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
  return {
    h: hsv[0],
    s: hsv[1],
    v: hsv[2],
  }
}

export function hsvToRgb(h: number, s: number, v: number): number[] {
  const _h = (h / 360) * 6;
  const _s = s / 100;
  const _v = v / 100;

  const hh = Math.floor(_h);
  const l = _v * (1 - _s);
  const c = _v * (1 - (_h - hh) * _s);
  const d = _v * (1 - (1 - _h + hh) * _s);
  const module = hh % 6;

  return [
    Math.round([_v, c, l, l, d, _v][module] * 255),
    Math.round([d, _v, _v, c, l, l][module] * 255),
    Math.round([l, l, d, _v, _v, c][module] * 255),
  ];
}

export const rgbToHsv = (r: number, g: number, b: number): number[] => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return [
    round(60 * (hh < 0 ? hh + 6 : hh), 3),
    round(max ? (delta / max) * 100 : 0, 3),
    round((max / 255) * 100, 3),
  ];
};

// https://css-tricks.com/converting-color-spaces-in-javascript/

export const rgbToHex = (
  r: number | string,
  g: number | string,
  b: number | string,
) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};

export const hexToRgb = (h: string): number[] => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (h.length == 4) {
    r = parseInt("0x" + h[1] + h[1], 16);
    g = parseInt("0x" + h[2] + h[2], 16);
    b = parseInt("0x" + h[3] + h[3], 16);
  } else if (h.length == 7) {
    r = parseInt("0x" + h[1] + h[2], 16);
    g = parseInt("0x" + h[3] + h[4], 16);
    b = parseInt("0x" + h[5] + h[6], 16);
  }

  return [r, g, b];
};

