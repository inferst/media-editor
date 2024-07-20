import { Accessor, createContext, useContext } from "solid-js";

export type SliderState = {
  offsetStart: Accessor<number>;
  offsetEnd: Accessor<number>;
  position: Accessor<number>;
  trackRef: Accessor<HTMLElement | undefined>;
  thumbRef: Accessor<HTMLElement | undefined>;
  registerTrack: (ref: HTMLElement) => void;
  registerThumb: (ref: HTMLElement) => void;
};

export type SliderContextValue = {
  state: SliderState;
  onSlideStart: (value?: number) => void;
};

export const SliderContext = createContext<SliderContextValue>();

export const useSliderContext = (name: string) => {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error(
      `[${name}]: useSliderContext should be called inside its ContextProvider`,
    );
  }

  return context;
};
