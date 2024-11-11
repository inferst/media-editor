import { Component, mergeProps } from "solid-js";

type SVGFilterProps = {
  blur?: number;
};

export const SVGFilter: Component<SVGFilterProps> = (_props) => {
  const props = mergeProps({ blur: 6 }, _props);

  return (
    <svg
      style={{ visibility: "hidden", position: "absolute" }}
      width="0"
      height="0"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <filter id="round">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={props.blur}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="matrix"
          />
          <feComposite in="SourceGraphic" in2="matrix" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};
