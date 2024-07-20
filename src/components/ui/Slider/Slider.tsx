import { Component } from "solid-js";
import styles from "./Slider.module.css";
import SliderRoot from "../primitives/Slider/SliderRoot";
import SliderTrack from "../primitives/Slider/SliderTrack";
import SliderRange from "../primitives/Slider/SliderRange";
import SliderThumb from "../primitives/Slider/SliderThumb";

type SliderProps = {
  value?: number;
  default?: number;
  min?: number;
  max?: number;
  color?: string;
  onChange: (value: number) => void;
};

const Slider: Component<SliderProps> = (props) => {
  return (
    <SliderRoot
      min={props.min}
      max={props.max}
      default={props.default}
      onChange={props.onChange}
      value={props.value}
      class={styles.root}
    >
      <SliderTrack class={styles.track}>
        <SliderRange class={styles.range} style={{"background-color": props.color}} />
      </SliderTrack>
      <SliderThumb class={styles.thumb} style={{"background-color": props.color}}/>
    </SliderRoot>
  );
};

export default Slider;
