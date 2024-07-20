import { Component, createEffect, createSignal } from "solid-js";
import { linearScale } from "../../../helpers";
import SliderRange from "../../primitives/Slider/SliderRange";
import SliderRoot from "../../primitives/Slider/SliderRoot";
import SliderThumb from "../../primitives/Slider/SliderThumb";
import SliderTrack from "../../primitives/Slider/SliderTrack";
import { hexToHsv } from "../colorConverters";
import styles from "./GradientSlider.module.css";

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
  let prevHue = 0;
  const result = [];

  for (const step of gradient) {
    const hsv = hexToHsv(step.color);
    let hue = hsv.h;

    if (hue < prevHue) {
      hue = 360;
    }

    prevHue = hue;

    result.push({
      hue,
      value: step.value,
    });
  }

  return result;
};

const GradientSlider: Component<GradientSliderProps> = (props) => {
  const [value, setValue] = createSignal(0);

  const hueGradient = toHueGradient(gradient);

  const getValue = (
    hue: number,
    start?: { hue: number; value: number },
    end?: { hue: number; value: number },
  ): number | undefined => {
    if (!start) {
      return 0;
    }

    if (!end) {
      return 100;
    }

    if (hue >= start.hue && hue <= end.hue) {
      const scale = linearScale([start.hue, end.hue], [start.value, end.value]);
      return scale(hue);
    }
  };

  createEffect((prev) => {
    for (let i = 0; i < hueGradient.length; i++) {
      const step = hueGradient[i];
      const next = hueGradient[i + 1];

      const converted = getValue(props.hue, step, next);

      if (converted && converted != prev) {
        setValue(converted);
        setHue(props.hue);
        return converted;
      }
    }
  }, 0);

  const [hue, setHue] = createSignal(0);

  const handleChange = (value: number) => {
    setValue(value);

    let hue = 0;

    let start = hueGradient[0];
    let end = hueGradient[hueGradient.length - 1];

    if (value < start.value) {
      hue = 0;
    } else if (value > end.value) {
      hue = 360;
    } else {
      for (let i = 0; i < hueGradient.length; i++) {
        const step = hueGradient[i];
        const next = hueGradient[i + 1];

        if (step.value > value && value != 0) {
          break;
        }

        start = { hue: step.hue, value: step.value };
        end = { hue: next.hue, value: next.value };
      }

      const scale = linearScale([start.value, end.value], [start.hue, end.hue]);
      hue = scale(value);
    }

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
      </SliderTrack>
      <SliderThumb
        class={styles.thumb}
        style={{
          "background-color": `hsl(${hue()} 100% 50%)`,
        }}
      />
    </SliderRoot>
  );
};

export default GradientSlider;
