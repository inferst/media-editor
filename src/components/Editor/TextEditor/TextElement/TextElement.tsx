import { Component } from "solid-js";
import { Point } from "../../../../types/editor";
import { TextOptions } from "../../../../types/text";
import { ContentEditable } from "./ContentEditable";
import styles from "./TextElement.module.css";

export type TextElementProps = {
  options: TextOptions;
  position: Point;
  onFocus: () => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  return (
    <div
      class={styles.element}
      style={{
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
        color: props.options.color,
        "font-size": `${props.options.size}px`,
      }}
    >
      <ContentEditable onFocus={() => props.onFocus()} />
    </div>
  );
};
