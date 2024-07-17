import {
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  ParentComponent,
} from "solid-js";
import styles from "./Slider.module.css";

type SliderProps = {
  value?: number;
  default?: number;
  min?: number;
  max?: number;
  color?: string;
  onChange: (value: number) => void;
};

const Slider: ParentComponent<SliderProps> = (props) => {
  const merged = mergeProps({ value: 0, default: 0, min: 0, max: 100 }, props);

  const value = createMemo(() => {
    if (merged.value > merged.max) {
      return merged.max;
    } else if (merged.value < merged.min) {
      return merged.min;
    }

    return merged.value;
  });

  const toPercent = (value: number) => {
    return (Math.abs(merged.min - value) / (merged.max - merged.min)) * 100;
  };

  const trackX = createMemo(() => {
    const x = value() >= merged.default ? merged.default : value();
    return toPercent(x);
  });

  const trackWidth = createMemo(() => {
    const width = value() >= merged.default ? value() : merged.default;
    return toPercent(width) - trackX();
  });

  let sliderRef: HTMLDivElement | undefined;
  let thumbRef: HTMLDivElement | undefined;

  const [sliderWidth, setSliderWidth] = createSignal(0);

  let isDrag = false;

  let sliderPosX = 0;
  let thumbWidth = 0;

  const handleMouseUp = () => {
    isDrag = false;
  };

  const init = () => {
    if (sliderRef && thumbRef) {
      const sliderRect = sliderRef.getBoundingClientRect();
      sliderPosX = sliderRect.x;

      const thumbRect = thumbRef.getBoundingClientRect();
      thumbWidth = thumbRect.width;

      setSliderWidth(sliderRect.width - thumbWidth);
    }
  };

  const update = (event: MouseEvent) => {
    const width = sliderWidth();
    let position = event.pageX - sliderPosX - thumbWidth / 2;

    if (position < 0) {
      position = 0;
    }

    if (position > width) {
      position = width;
    }

    const distance = merged.max - merged.min;
    const newValue = Math.round((position * distance) / width) + merged.min;

    if (newValue != value()) {
      props.onChange(newValue);
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    isDrag = true;

    init();
    update(event);
  };

  const thumbxValueX = createMemo(() => {
    return (toPercent(value()) * sliderWidth()) / 100;
  });

  const handleMouseMove = (event: MouseEvent) => {
    if (isDrag) {
      update(event);
    }
  };

  let observer: IntersectionObserver;

  onMount(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    console.log("mount");

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        init();
      }
    }, options);

    if (sliderRef) {
      observer.observe(sliderRef);
    }
  });

  onCleanup(() => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);

    if (sliderRef) {
      console.log(observer);
      observer.unobserve(sliderRef);
    }
  });

  return (
    <div class={styles.slider}>
      {value()}
      <div
        onMouseDown={handleMouseDown}
        ref={sliderRef}
        class={styles["slider-track"]}
      >
        <div
          class={styles["slider-track--active"]}
          style={{
            left: `${trackX()}%`,
            width: `${trackWidth()}%`,
            "background-color": props.color,
          }}
        />
      </div>
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        class={styles["slider-thumb"]}
        style={{
          left: `${thumbxValueX()}px`,
          "background-color": props.color,
        }}
      />
      {props.children}
    </div>
  );
};

export default Slider;
