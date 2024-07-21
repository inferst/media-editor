import { Component, createMemo, createSignal, For, Show } from "solid-js";
import styles from "./Colors.module.css";
import SaturationPicker from "./SaturationPicker/SaturationPicker";
import HueSlider from "./HueSlider/HueSlider";
import {
  hexToHsv,
  hsvEquals,
  HsvObject,
  hsvToHex,
  hsvToRgb,
  rgbToHsv,
  rgbToObject,
} from "../../../utils/color";
import TextInput from "../TextInput/TextInput";
import ColorButton from "./ColorButton/ColorButton";

type ColorsProps = {
  colors: string[];
  onChange: (color: string) => void;
};

const Colors: Component<ColorsProps> = (props) => {
  const [color, setColor] = createSignal<HsvObject>({
    h: 0,
    s: 0,
    v: 100,
  });

  const [isColorPicker, setIsColorPicker] = createSignal(false);
  const [sliderHue, setSliderHue] = createSignal(0);

  const colors = createMemo(() => {
    return props.colors.map((color) => {
      return hexToHsv(color);
    });
  });

  const isActive = (hsv: HsvObject) => {
    return hsvEquals(hsv, color()) && !isColorPicker();
  };

  const hex = createMemo(() => {
    return hsvToHex(color()).toUpperCase();
  });

  const rgb = createMemo(() => {
    const hsv = color();
    const rgb = hsvToRgb(hsv);
    return `${rgb.r},${rgb.g},${rgb.b}`;
  });

  const updateColor = (hsv: HsvObject) => {
    setColor(hsv);
    props.onChange(hsvToHex(hsv));
  };

  const handleHueChange = (hue: number) => {
    const hsv = { ...color(), h: hue };
    updateColor(hsv);
  };

  const handleHexChange = (value: string) => {
    const hsv = hexToHsv(value);
    updateColor(hsv);
    setSliderHue(hsv.h);
  };

  const handleRgbChange = (value: string) => {
    const rgb = rgbToObject(value);
    const hsv = rgbToHsv(rgb);
    updateColor(hsv);
    setSliderHue(hsv.h);
  };

  const handleSaturationChange = (s: number, v: number) => {
    const hsv = { ...color(), s, v };
    updateColor(hsv);
  };

  return (
    <>
      <div class={styles.colors}>
        <Show
          when={!isColorPicker()}
          fallback={<HueSlider hue={sliderHue()} onChange={handleHueChange} />}
        >
          <For each={colors()}>
            {(color) => (
              <ColorButton
                color={hsvToHex(color)}
                isActive={isActive(color)}
                onClick={() => {
                  setIsColorPicker(false);
                  setSliderHue(color.h);
                  updateColor(color);
                }}
              />
            )}
          </For>
        </Show>
        <ColorButton
          color="hue"
          isActive={isColorPicker()}
          onClick={() => {
            setIsColorPicker(!isColorPicker());
            setSliderHue(color().h);
          }}
        />
      </div>
      <Show when={isColorPicker()}>
        <div class={styles.picker}>
          <SaturationPicker hsv={color()} onChange={handleSaturationChange} />
          <div class={styles.input}>
            <TextInput
              placeholder="HEX"
              value={hex()}
              onChange={handleHexChange}
            />
            <TextInput
              placeholder="RGB"
              value={rgb()}
              onChange={handleRgbChange}
            />
          </div>
        </div>
      </Show>
    </>
  );
};

export default Colors;
