import clsx from "clsx";
import { Component, createMemo, mergeProps } from "solid-js";
import styles from "./Slider.module.css";

export type SliderVariant = "default" | "active";

type SliderProps = {
  value?: number;
  default?: number;
  min?: number;
  max?: number;
  variant?: SliderVariant;
  onChange: (value: number) => void;
};

const Slider: Component<SliderProps> = (props) => {
  const merged = mergeProps({ value: 0, default: 0, min: 0, max: 100 }, props);

  let inputRef: HTMLInputElement | undefined;

  const value = createMemo(() => {
    if (merged.value > merged.max) {
      return merged.max;
    } else if (merged.value < merged.min) {
      return merged.min;
    }

    return merged.value;
  });

  const handleChange = () => {
    if (inputRef) {
      const value = Number(inputRef.value);
      props.onChange(value);
    }
  };

  const toPercent = (value: number) =>
    (value / (merged.max - merged.min)) * 100;

  const left = createMemo(() =>
    value() >= merged.default
      ? -toPercent(merged.min - merged.default)
      : -toPercent(merged.min - value()),
  );

  const width = createMemo(() =>
    value() >= merged.default
      ? toPercent(value() - merged.default)
      : -toPercent(value() - merged.default),
  );

  return (
    <div
      class={clsx(styles.slider, {
        [styles["slider--active"]]: props.variant == "active",
      })}
    >
      <div
        class={styles["slider-track"]}
        style={{
          left: `${left()}%`,
          width: `${width()}%`,
        }}
      />
      <input
        ref={inputRef}
        type="range"
        min={merged.min}
        max={merged.max}
        value={merged.value}
        onInput={handleChange}
        class={styles["slider-input"]}
      />
    </div>
  );
};

export default Slider;
