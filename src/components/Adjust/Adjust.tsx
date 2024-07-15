import { Component, createMemo, JSX } from "solid-js";
import Label from "../Label/Label";
import Slider, { SliderVariant } from "../Slider/Slider";
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
  variant?: SliderVariant;
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

  const variantClass = () => {
    return {
      [styles.default]: props.variant == "default",
      [styles.active]: props.variant == "active",
    };
  };

  return (
    <div class={clsx(styles.adjust, variantClass())}>
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
          variant={props.variant}
        />
      </div>
    </div>
  );
};

export default Adjust;
