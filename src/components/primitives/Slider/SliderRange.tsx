import { ParentComponent } from "solid-js";
import { JSX } from "solid-js/h/jsx-runtime";
import { useSliderContext } from "./sliderContext";

export type SliderRangeProps = {
  style?: JSX.CSSProperties;
  class?: string;
};

const SliderRange: ParentComponent<SliderRangeProps> = (props) => {
  const context = useSliderContext("SliderRange");

  return (
    <div
      class={props.class}
      style={{
        position: "absolute",
        left: `${context.state.start()}%`,
        width: `${context.state.end()}%`,
        ...props.style,
      }}
    />
  );
};

export default SliderRange;
