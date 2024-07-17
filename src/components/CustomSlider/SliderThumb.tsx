import { JSX, ParentComponent } from "solid-js";
import { useSliderContext } from "./sliderContext";

export type SliderThumbProps = {
  class?: string;
  style?: JSX.CSSProperties;
};

const SliderThumb: ParentComponent<SliderThumbProps> = (props) => {
  const context = useSliderContext("SliderThumb");

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    context.onSlideStart();
  };

  return (
    <div style={{ padding: "0 10px", position: "relative" }}>
      <div
        ref={context.state.registerThumb}
        onMouseDown={handleMouseDown}
        class={props.class}
        style={{
          position: 'absolute',
          transform: "translateX(-50%)",
          left: `${context.state.position()}%`,
          ...props.style,
        }}
      />
    </div>
  );
};

export default SliderThumb;
