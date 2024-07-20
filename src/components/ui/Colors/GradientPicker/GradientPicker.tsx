import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { linearScale } from "../../../helpers";
import { HSV, hsvToHex } from "../colorConverters";
import styles from "./GradientPicker.module.css";

export type GradientPickerProps = {
  hsv: HSV;
  onChange: (s: number, v: number) => void;
};

const GradientPicker: Component<GradientPickerProps> = (props) => {
  let pickerRef: HTMLDivElement | undefined;
  let thumbRef: HTMLDivElement | undefined;

  let isDrag = false;

  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  const color = createMemo(() => {
    return hsvToHex(props.hsv);
  });

  const updatePosition = (s: number, v: number) => {
    if (thumbRef && pickerRef) {
      const thumbWidthPercent =
        (thumbRef.offsetWidth / pickerRef.offsetWidth) * 100;

      const offsetX = linearScale(
        [0, 100],
        [thumbWidthPercent / 2, 100 - thumbWidthPercent / 2],
      );

      setX(offsetX(s));

      const thumbHeightPercent =
        (thumbRef.offsetHeight / pickerRef.offsetHeight) * 100;

      const offsetY = linearScale(
        [0, 100],
        [thumbHeightPercent / 2, 100 - thumbHeightPercent / 2],
      );

      setY(offsetY(100 - v));
    }
  };

  createEffect(() => {
    updatePosition(props.hsv.s, props.hsv.v);
  });

  const update = (pageX: number, pageY: number) => {
    if (pickerRef && thumbRef) {
      const pickerRect = pickerRef.getBoundingClientRect();
      const thumbRect = thumbRef.getBoundingClientRect();

      const offsetX = linearScale(
        [thumbRect.width / 2, pickerRect.width - thumbRect.width / 2],
        [0, pickerRect.width],
      );

      const offsetY = linearScale(
        [thumbRect.height / 2, pickerRect.height - thumbRect.height / 2],
        [0, pickerRect.height],
      );

      const width = pickerRect.width;
      const height = pickerRect.height;

      let x = pageX - pickerRect.x;
      let y = pageY - pickerRect.y;

      if (x < thumbRect.width / 2) {
        x = thumbRect.width / 2;
      } else if (x > width - thumbRect.width / 2) {
        x = width - thumbRect.width / 2;
      }

      if (y < thumbRect.height / 2) {
        y = thumbRect.height / 2;
      } else if (y > height - thumbRect.height / 2) {
        y = height - thumbRect.height / 2;
      }

      const s = (offsetX(x) / pickerRef.offsetWidth) * 100;
      const v =
        ((pickerRef.offsetHeight - offsetY(y)) / pickerRef.offsetHeight) * 100;

      props.onChange(s, v);
    }
  };

  const handleMouseUp = () => {
    isDrag = false;
  };

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    isDrag = true;

    update(event.pageX, event.pageY);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDrag) {
      update(event.pageX, event.pageY);
    }
  };

  onMount(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    updatePosition(props.hsv.s, props.hsv.v);
  });

  onCleanup(() => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  });

  return (
    <div ref={pickerRef} onMouseDown={handleMouseDown} class={styles.picker}>
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
        ref={thumbRef}
        class={styles.thumb}
        style={{
          left: `${x()}%`,
          top: `${y()}%`,
          "background-color": `${color()}`,
        }}
      />
    </div>
  );
};

export default GradientPicker;
