export async function buildSvgFragment(
  fragment: string,
  width: number,
  height: number,
  fonts: string[],
) {
  const template = document.createElement("template");
  template.innerHTML = fragment;

  const child = template.content.firstElementChild;
  const xml = new XMLSerializer().serializeToString(child!);

  const fontFaces = fonts.map(async (font) => {
    const base64Font = (await import(`@/assets/fonts/${font}.woff2?base64`))
      .default;

    return `
      @font-face {
        font-family: ${font};
        src: url("data:font/woff2;base64,${base64Font}") format("woff2");
      }`;
  });

  const styles = await Promise.all(fontFaces);

  const svg = `
    <svg
      viewBox='0 0 ${width} ${height}'
      width="${width}"
      height="${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        ${styles.join("\n")}
      </style>
      <defs>
        <filter id="round">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <foreignObject
        x="0"
        y="0"
        width="${width}"
        height="${height}"
      >
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${xml}
        </div>
      </foreignObject>
    </svg>`;

  return svg;
}
