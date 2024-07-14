import { Component, JSX } from "solid-js";
import Label from "../Label/Label";
import Slider from "../Slider/Slider";
import styles from "./Adjust.module.css";

type AdjustProps = {
  heading: JSX.Element;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  value?: number;
  default?: number;
  color?: string;
};

const Adjust: Component<AdjustProps> = (props) => {
  return (
    <>
      <Label color={props.color} tail={props.value?.toString()}>
        {props.heading}
      </Label>
      <div class={styles.slider}>
        <Slider
          min={props.min}
          max={props.max}
          value={props.value}
          default={props.default}
          onChange={props.onChange}
        />
      </div>
    </>
  );
};

export default Adjust;
