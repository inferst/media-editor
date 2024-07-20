import {
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  ParentComponent,
} from "solid-js";
import { linearScale } from "../../../helpers";
import { SliderContext, SliderContextValue } from "./sliderContext";

type SliderProps = {
  value?: number;
  default?: number;
  min?: number;
  max?: number;
  class?: string;
  onChange: (value: number) => void;
};

const SliderRoot: ParentComponent<SliderProps> = (props) => {
  const merged = mergeProps({ value: 0, default: 0, min: 0, max: 100 }, props);

  const [trackRef, setTrackRef] = createSignal<HTMLElement>();
  const [thumbRef, setThumbRef] = createSignal<HTMLElement>();

  const value = createMemo(() => {
    if (merged.value > merged.max) {
      return merged.max;
    } else if (merged.value < merged.min) {
      return merged.min;
    }

    return merged.value;
  });

  const [thumbDiffPercent, setThumbDiffPercent] = createSignal(0);

  const toPercent = (value: number) => {
    const percent =
      (Math.abs(value - merged.min) / (merged.max - merged.min)) * 100;

    return percent;
  };

  const position = createMemo(() => {
    const offset = linearScale(
      [0, 100],
      [thumbDiffPercent(), 100 - thumbDiffPercent()],
    );

    return offset(toPercent(value()));
  });

  const offsetStart = createMemo(() => {
    const x = value() >= merged.default ? merged.default : value();
    const offset = linearScale([0, 100], [0, 100 - thumbDiffPercent()]);

    return offset(toPercent(x));
  });

  const offsetEnd = createMemo(() => {
    const width = value() >= merged.default ? value() : merged.default;
    const offset = linearScale([0, 100], [0, 100 - thumbDiffPercent()]);

    return offset(toPercent(width)) - offsetStart();
  });

  let isDrag = false;

  const updateOffset = () => {
    const track = trackRef();
    const thumb = thumbRef();

    if (track && thumb) {
      const thumbDiffPercent =
        ((thumb.offsetWidth / track.offsetWidth) * 100) / 2;

      setThumbDiffPercent(thumbDiffPercent);
    }
  };

  const update = (pageX: number) => {
    const track = trackRef();
    const thumb = thumbRef();

    if (track && thumb) {
      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      const width = trackRect.width - thumbRect.width;
      let position = pageX - trackRect.x - thumbRect.width / 2;

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
    }
  };

  const handleMouseUp = () => {
    isDrag = false;
  };

  const handleSlideStart = (position?: number) => {
    isDrag = true;

    if (position) {
      update(position);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDrag) {
      update(event.pageX);
    }
  };

  onMount(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    updateOffset();
  });

  onCleanup(() => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  });

  const context: SliderContextValue = {
    state: {
      offsetStart,
      offsetEnd,
      position,
      trackRef,
      thumbRef,
      registerTrack: setTrackRef,
      registerThumb: setThumbRef,
    },
    onSlideStart: handleSlideStart,
  };

  return (
    <SliderContext.Provider value={context}>
      <div class={props.class} style={{ position: "relative" }}>
        {props.children}
      </div>
    </SliderContext.Provider>
  );
};

export default SliderRoot;
