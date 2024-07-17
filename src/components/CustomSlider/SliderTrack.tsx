import { ParentComponent } from "solid-js";
import { useSliderContext } from "./sliderContext";

export type SliderTrackProps = {
  class?: string;
};

const SliderTrack: ParentComponent<SliderTrackProps> = (props) => {
  const context = useSliderContext("SliderTrack");

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    context.onSlideStart(event.pageX);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      ref={context.state.registerTrack}
      class={props.class}
    >
      {props.children}
    </div>
  );
};

export default SliderTrack;
