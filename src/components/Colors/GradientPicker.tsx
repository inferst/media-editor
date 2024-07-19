import { Component } from "solid-js";
import styles from "./GradientPicker.module.css";
import { HSV } from "./colorConverters";

export type GradientPickerProps = {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
};

const GradientPicker: Component<GradientPickerProps> = (props) => {
  let divRef: HTMLDivElement | undefined;

  const handleClick = (event: MouseEvent) => {
    if (divRef) {
      const s = ((event.pageX - divRef.offsetLeft) / divRef.offsetWidth) * 100;
      const v =
        ((divRef.offsetTop + divRef.offsetHeight - event.pageY) /
          divRef.offsetHeight) *
        100;

      props.onChange(s, v);
    }
  };

  return (
    <div ref={divRef} onClick={handleClick} class={styles.picker}>
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
    </div>
  );
};

export default GradientPicker;
