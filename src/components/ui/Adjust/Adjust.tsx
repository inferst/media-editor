import { Component, createMemo, JSX } from "solid-js";
import styles from "./Adjust.module.css";
import clsx from "clsx";
import Label from "../Label/Label";
import Slider from "../Slider/Slider";

type AdjustVariant = "default" | "highlight";

type AdjustProps = {
  heading: JSX.Element;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  value?: number;
  default?: number;
  color?: string;
  variant?: AdjustVariant;
};

const Adjust: Component<AdjustProps> = (props) => {
  const tail = createMemo(() => {
    return (
      <div
        class={clsx(styles.value, {
          [styles.empty]: props.default == props.value,
        })}
        style={{
          color: props.default != props.value ? props.color : undefined,
        }}
      >
        {props.value}
      </div>
    );
  });

  return (
    <div
      class={clsx(styles.adjust, {
        [styles.highlight]: props.variant == "highlight",
      })}
    >
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
          color={props.color}
        />
      </div>
    </div>
  );
};

export default Adjust;
