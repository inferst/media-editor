/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, createEffect, createSignal } from "solid-js";
import SliderRange from "../CustomSlider/SliderRange";
import SliderRoot from "../CustomSlider/SliderRoot";
import SliderThumb from "../CustomSlider/SliderThumb";
import SliderTrack from "../CustomSlider/SliderTrack";
import { linearScale } from "../helpers";
import { hexToHsv, HSV } from "./colorConverters";
import styles from "./GradientSlider.module.css";

export type GradientStep = {
  color: string;
  edge: number;
};

export type GradientSliderProps = {
  hue: number;
  onChange: (hue: number) => void;
};

const GradientSlider: Component<GradientSliderProps> = (props) => {
  const [value, setValue] = createSignal(0);

  // Custom gradient
  const gradient: GradientStep[] = [
    { color: "#FF0000", edge: 5.21 },
    { color: "#FF8A00", edge: 16.48 },
    { color: "#FFE600", edge: 27.74 },
    { color: "#14FF00", edge: 39.35 },
    { color: "#00A3FF", edge: 49.37 },
    { color: "#0500FF", edge: 61.18 },
    { color: "#AD00FF", edge: 72.26 },
    { color: "#FF00C7", edge: 83.53 },
    { color: "#FF0000", edge: 94.61 },
  ];

  let prevHue = 0;

  const hsvGradient = gradient.map((step) => {
    const hsv = hexToHsv(step.color);

    if (hsv.h < prevHue) {
      hsv.h = 360;
    }

    prevHue = hsv.h;

    return {
      hsv,
      edge: step.edge,
    };
  });

  const getValue = (
    hue: number,
    start?: { hsv: HSV; edge: number },
    end?: { hsv: HSV; edge: number },
  ): number | undefined => {
    if (!start) {
      return 0;
    }

    if (!end) {
      return 100;
    }

    if (hue >= start.hsv.h && hue <= end.hsv.h) {
      const scale = linearScale(
        [start.hsv.h, end.hsv.h],
        [start.edge, end.edge],
      );

      return scale(hue);
    }
  };

  createEffect((prev) => {
    for (let i = 0; i < hsvGradient.length; i++) {
      const step = hsvGradient[i];
      const next = hsvGradient[i + 1];

      const converted = getValue(props.hue, step, next);

      console.log(converted);
      if (converted && converted != prev) {
        console.log(converted);
        setValue(converted);
        return converted;
      }
    }
  }, 0);

  const getHue = (
    value: number,
    start?: { hue: number; edge: number },
    end?: { hue: number; edge: number },
  ): number => {
    if (!start) {
      start = { hue: 0, edge: 0 };
    }

    if (!end) {
      end = { hue: 360, edge: 359 };
    }

    const scale = linearScale([start.edge, end.edge], [start.hue, end.hue]);

    return scale(value);
  };

  const handleChange = (v: number) => {
    setValue(v);

    let startHue;
    let endHue;

    for (let i = 0; i < hsvGradient.length; i++) {
      const step = hsvGradient[i];
      const next = hsvGradient[i + 1];

      if (step.edge > v && v != 0) {
        break;
      }

      startHue = { hue: step.hsv.h, edge: step.edge };
      endHue = next
        ? {
            hue: next.hsv.h,
            edge: next.edge,
          }
        : endHue;
    }

    console.log(hsvGradient)
    console.log(startHue, endHue);

    const hue = getHue(v, startHue, endHue);

    if (hue != props.hue) {
      props.onChange(hue);
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
      <SliderThumb class={styles.thumb} />
    </SliderRoot>
  );
};

export default GradientSlider;
