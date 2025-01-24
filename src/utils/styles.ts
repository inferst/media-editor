import { JSX } from "solid-js";

export function px(value: number) {
  return `${value}px`;
}

export type StyleMap = {
  [selector in string]: JSX.CSSProperties;
};

export function generateStyle(style: StyleMap): string {
  let str = "";

  for (const selector in style) {
    str += `${selector} {`;

    for (const [prop, value] of Object.entries(style[selector])) {
      if (value != undefined) {
        str += `${prop}:${value};`;
      }
    }

    str += "}";
  }

  return str;
}
