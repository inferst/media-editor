import { ParentComponent } from "solid-js";
import { useSliderContext } from "./sliderContext";
import { JSX } from "solid-js/h/jsx-runtime";

export type SliderRangeProps = {
  style?: JSX.CSSProperties;
  class?: string;
};

const SliderRange: ParentComponent<SliderRangeProps> = (props) => {
  const context = useSliderContext('SliderRange');

  return (
    <div
      class={props.class}
      style={{
        position: 'absolute',
        left: `${context.state.offsetStart()}%`,
        width: `${context.state.offsetEnd()}%`,
        ...props.style,
      }}
    />
  );
};

export default SliderRange;
