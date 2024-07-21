import { Component, createEffect, createSignal } from "solid-js";
import { hexToHsv } from "../../../../utils/color";
import { linearScale } from "../../../../utils/number";
import SliderRange from "../../../primitives/Slider/SliderRange";
import SliderRoot from "../../../primitives/Slider/SliderRoot";
import SliderThumb from "../../../primitives/Slider/SliderThumb";
import SliderTrack from "../../../primitives/Slider/SliderTrack";
import styles from "./HueSlider.module.css";

export type ColorGradientStep = {
  color: string;
  value: number;
};

export type HueGradientStep = {
  hue: number;
  value: number;
};

export type GradientSliderProps = {
  hue: number;
  onChange: (hue: number) => void;
};

// Custom gradient
const gradient: ColorGradientStep[] = [
  { color: "#FF0000", value: 5.21 },
  { color: "#FF8A00", value: 16.48 },
  { color: "#FFE600", value: 27.74 },
  { color: "#14FF00", value: 39.35 },
  { color: "#00A3FF", value: 49.37 },
  { color: "#0500FF", value: 61.18 },
  { color: "#AD00FF", value: 72.26 },
  { color: "#FF00C7", value: 83.53 },
  { color: "#FF0000", value: 94.61 },
];

const toHueGradient = (gradient: ColorGradientStep[]): HueGradientStep[] => {
  const lastIndex = gradient.length - 1;
  return gradient.map((step, index) => {
    const hue = hexToHsv(step.color).h;
    return {
      hue: index == lastIndex ? 360 : hue,
      value: step.value,
    };
  });
};

const getScalableHue = (value: number, gradient: HueGradientStep[]) => {
  if (value < gradient[0].value) {
    return 0;
  } else if (value > gradient.slice(-1)[0].value) {
    return 360;
  } else {
    for (let i = 0; i < gradient.length - 2; i++) {
      const start = gradient[i];
      const end = gradient[i + 1];

      if (value >= start.value && value <= end.value) {
        const scale = linearScale(
          [start.value, end.value],
          [start.hue, end.hue],
        );

        return scale(value);
      }
    }

    return 0;
  }
};

const getScalableValue = (hue: number, gradient: HueGradientStep[]) => {
  if (hue < gradient[0].hue) {
    return 0;
  } else if (hue > gradient.slice(-1)[0].hue) {
    return 100;
  } else {
    for (let i = 0; i < gradient.length - 2; i++) {
      const start = gradient[i];
      const end = gradient[i + 1];

      if (hue >= start.hue && hue <= end.hue) {
        const scale = linearScale(
          [start.hue, end.hue],
          [start.value, end.value],
        );

        return scale(hue);
      }
    }

    return 0;
  }
};

const HueSlider: Component<GradientSliderProps> = (props) => {
  const [value, setValue] = createSignal(0);
  const [hue, setHue] = createSignal(0);

  const hueGradient = toHueGradient(gradient);

  createEffect((prev) => {
    const value = getScalableValue(props.hue, hueGradient);

    if (value != prev) {
      setValue(value);
      setHue(props.hue);

      return value;
    }

    return prev;
  }, 0);

  const handleChange = (value: number) => {
    setValue(value);

    const hue = getScalableHue(value, hueGradient);

    if (hue != props.hue) {
      props.onChange(hue);
      setHue(hue);
    }
  };

  return (
    <SliderRoot
      min={0}
      max={100}
      default={0}
      onChange={handleChange}
      value={value()}
      class={styles.root}
    >
      <SliderTrack class={styles.track}>
        <SliderRange class={styles.range} />
        <SliderThumb
          class={styles.thumb}
          style={{
            "background-color": `hsl(${hue()} 100% 50%)`,
          }}
        />
      </SliderTrack>
    </SliderRoot>
  );
};

export default HueSlider;
