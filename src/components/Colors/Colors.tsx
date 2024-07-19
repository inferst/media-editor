import clsx from "clsx";
import { Component, createMemo, createSignal, For, Show } from "solid-js";
import styles from "./Colors.module.css";
import GradientPicker from "./GradientPicker";
import GradientSlider from "./GradientSlider";
import { hexToHsv, HSV, hsvToHex } from "./colorConverters";

type ColorProps = {
  color: HSV;
};

type ColorsProps = {
  colors: string[];
  onChange: (color: string) => void;
};

const Colors: Component<ColorsProps> = (props) => {
  const [color, setColor] = createSignal<HSV>({
    h: 0,
    s: 0,
    v: 0,
  });

  const [isColorPicker, setIsColorPicker] = createSignal(false);
  const [sliderHue, setSliderHue] = createSignal(0);

  const colors = createMemo(() => {
    return props.colors.map((color) => {
      return hexToHsv(color);
    });
  });

  const Color = (props: ColorProps) => {
    const color = createMemo(() => {
      return hsvToHex(props.color);
    });

    return <div class={styles.color} style={{ "background-color": color() }} />;
  };

  const RainbowColor = () => {
    return <div class={clsx(styles.color, styles["color--rainbow"])} />;
  };

  const isActive = (hsv: HSV) => {
    return (
      hsv.h == color().h &&
      hsv.s == color().s &&
      hsv.v == color().v &&
      !isColorPicker()
    );
  };

  const handleSliderHueChange = (hue: number) => {
    const hex = hsvToHex({ ...color(), h: hue });
    props.onChange(hex);
    setColor({ ...color(), h: hue });
  };

  return (
    <>
      <div class={styles.colors}>
        <Show
          when={!isColorPicker()}
          fallback={
            <GradientSlider
              hue={sliderHue()}
              onChange={handleSliderHueChange}
            />
          }
        >
          <For each={colors()}>
            {(color) => (
              <div
                onClick={() => {
                  setIsColorPicker(false);
                  setColor(color);
                  setSliderHue(color.h);
                  props.onChange(hsvToHex(color));
                }}
                class={clsx(styles["color-wrapper"], {
                  [styles["color-wrapper--active"]]: isActive(color),
                })}
              >
                <Color color={color} />
              </div>
            )}
          </For>
        </Show>
        <div
          onClick={() => {
            setIsColorPicker(!isColorPicker());
          }}
          class={clsx(styles["color-wrapper"], {
            [styles["color-wrapper--active"]]: isColorPicker(),
          })}
        >
          <RainbowColor />
        </div>
      </div>
      <Show when={isColorPicker()}>
        <div class={styles.picker}>
          <GradientPicker
            hsv={color()}
            onChange={(s, v) => {
              setColor({ ...color(), s, v });
              props.onChange(
                hsvToHex({
                  ...color(),
                  s,
                  v,
                }),
              );
            }}
          />
        </div>
      </Show>
    </>
  );
};

export default Colors;
