import { Component, createMemo, JSX } from "solid-js";
import Label from "../Label/Label";
import Slider from "../CustomSlider/Slider";
import styles from "./Adjust.module.css";
import clsx from "clsx";

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
  const tail = createMemo(() => {
    return (
      <div
        class={clsx(styles.value, {
          [styles.empty]: props.default == props.value,
        })}
      >
        {props.value}
      </div>
    );
  });

  return (
    <div class={clsx(styles.adjust)}>
      <Label tail={tail()}>
        <div class={styles.heading}>{props.heading}</div>
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
    </div>
  );
};

export default Adjust;
