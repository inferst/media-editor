import { Component, createSignal, For, Show } from "solid-js";
import styles from "./Colors.module.css";
import clsx from "clsx";

type ColorProps = {
  color: string;
};

type ColorsProps = {
  color: string;
  onChange: (color: string) => void;
};

const Colors: Component<ColorsProps> = (props) => {
  const [isColorPicker, setIsColorPicker] = createSignal(false);

  const colors = [
    "#FFFFFF",
    "#FE4438",
    "#FF8901",
    "#FFD60A",
    "#33C759",
    "#62E5E0",
    "#0A84FF",
    "#BD5CF3",
  ];

  const Color = (props: ColorProps) => {
    return (
      <div class={styles.color} style={{ "background-color": props.color }} />
    );
  };

  const RainbowColor = () => {
    return <div class={clsx(styles.color, styles["color--rainbow"])} />;
  };

  const isActive = (color: string) => {
    return color.toUpperCase() == props.color.toUpperCase() && !isColorPicker();
  };

  return (
    <>
      <div class={styles.colors}>
        <Show
          when={!isColorPicker()}
          fallback={<div class={styles.gradient} />}
        >
          <For each={colors}>
            {(color) => (
              <div
                onClick={() => {
                  setIsColorPicker(false);
                  props.onChange(color);
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
    </>
  );
};

export default Colors;
