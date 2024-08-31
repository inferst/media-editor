import {
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onMount,
  ParentComponent,
} from "solid-js";
import { createMove } from "../../../hooks/createMove";
import { linearScale } from "../../../utils/number";
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

  const [trackOffset, setTrackOffset] = createSignal(0);

  const toPercent = (value: number) => {
    return Math.abs(value - merged.min) / (merged.max - merged.min);
  };

  const position = createMemo(() => {
    const offset = linearScale([0, 1], [trackOffset(), 1 - trackOffset()]);
    return offset(toPercent(value())) * 100;
  });

  const start = createMemo(() => {
    const x = value() >= merged.default ? merged.default : value();
    const offset = linearScale([0, 1], [0, 1 - trackOffset()]);
    return offset(toPercent(x)) * 100;
  });

  const end = createMemo(() => {
    const width = value() >= merged.default ? value() : merged.default;
    const offset = linearScale([0, 1], [0, 1 - trackOffset()]);
    return offset(toPercent(width)) * 100 - start();
  });

  onMount(() => {
    setTrackOffset(getTrackOffset());
  });

  const getTrackOffset = () => {
    const track = trackRef();
    const thumb = thumbRef();

    if (track && thumb) {
      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      return thumbRect.width / trackRect.width / 2;
    }

    return 0;
  };

  const { setRef } = createMove((position) => {
    const trackOffset = getTrackOffset();
    const offsetScale = linearScale([trackOffset, 1 - trackOffset], [0, 1]);

    const x = Math.min(Math.max(offsetScale(position.x), 0), 1);

    const distance = merged.max - merged.min;
    const newValue = Math.round(x * distance + merged.min);

    if (newValue != value()) {
      props.onChange(newValue);
    }
  });

  createEffect(() => {
    setRef(trackRef());
  });

  const context: SliderContextValue = {
    state: {
      start,
      end,
      position,
      trackRef,
      thumbRef,
      registerTrack: setTrackRef,
      registerThumb: setThumbRef,
    },
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
