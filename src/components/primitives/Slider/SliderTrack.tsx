import { ParentComponent } from "solid-js";
import { useSliderContext } from "./sliderContext";

export type SliderTrackProps = {
  class?: string;
};

const SliderTrack: ParentComponent<SliderTrackProps> = (props) => {
  const context = useSliderContext("SliderTrack");

  return (
    <div
      ref={(ref) => {
        context.state.registerTrack(ref);
      }}
      class={props.class}
    >
      {props.children}
    </div>
  );
};

export default SliderTrack;
