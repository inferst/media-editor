import clsx from "clsx";
import { Hex } from "../../../../utils/color";
import styles from "./ColorButton.module.css";

export type ColorButtonColor = Hex | "hue";

type ColorProps = {
  color: ColorButtonColor;
  isActive: boolean;
  onClick: (color: ColorButtonColor) => void;
};

const ColorButton = (props: ColorProps) => {
  return (
    <div
      onClick={() => {
        props.onClick(props.color);
      }}
      class={clsx(styles.wrapper, {
        [styles.active]: props.isActive,
      })}
    >
      <div
        class={clsx(styles.color, { [styles.rainbow]: props.color == "hue" })}
        style={{
          "background-color": props.color != "hue" ? props.color : undefined,
        }}
      />
    </div>
  );
};

export default ColorButton;
