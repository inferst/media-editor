import { JSX, ParentComponent } from "solid-js";
import { useSliderContext } from "./sliderContext";

export type SliderThumbProps = {
  class?: string;
  style?: JSX.CSSProperties;
};

const SliderThumb: ParentComponent<SliderThumbProps> = (props) => {
  const context = useSliderContext("SliderThumb");

  return (
    <div
      ref={context.state.registerThumb}
      class={props.class}
      style={{
        position: "absolute",
        transform: "translateX(-50%)",
        left: `${context.state.position()}%`,
        ...props.style,
      }}
    />
  );
};

export default SliderThumb;
