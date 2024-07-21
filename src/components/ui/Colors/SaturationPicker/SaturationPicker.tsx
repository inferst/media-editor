import { Component, createMemo } from "solid-js";
import { createMove } from "../../../../hooks/createMove";
import { HsvObject, hsvToHex } from "../../../../utils/color";
import styles from "./SaturationPicker.module.css";

export type SaturationPickerProps = {
  hsv: HsvObject;
  onChange: (s: number, v: number) => void;
};

const SaturationPicker: Component<SaturationPickerProps> = (props) => {
  const move = createMove<HTMLDivElement>((position) => {
    props.onChange(position.x * 100, (1 - position.y) * 100);
  });

  const color = createMemo(() => {
    return hsvToHex(props.hsv);
  });

  const position = createMemo(() => {
    return {
      x: props.hsv.s / 100,
      y: (100 - props.hsv.v) / 100,
    }
  })

  return (
    <div ref={move.setRef} class={styles.picker}>
      <div
        class={styles.overlay}
        style={{
          "background-color": `hsl(${props.hsv.h}, 100%, 50%)`,
        }}
      />

      <div
        class={styles.overlay}
        style={{
          "background-image": "linear-gradient(90deg, #fff, transparent)",
        }}
      />

      <div
        class={styles.overlay}
        style={{
          "background-image": "linear-gradient(0deg, #000, transparent)",
        }}
      />

      <div
        class={styles.thumb}
        style={{
          "background-color": `${color()}`,
          "left": `${Math.round(position().x * 100)}%`,
          "top": `${Math.round(position().y * 100)}%`,
        }}
      />
    </div>
  );
};

export default SaturationPicker;
