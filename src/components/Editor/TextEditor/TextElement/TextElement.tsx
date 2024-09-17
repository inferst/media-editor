import { Component } from "solid-js";
import { Point } from "../../../../types/editor";
import { TextOptions } from "../../../../types/text";
import { ContentEditable } from "./ContentEditable";
import styles from "./TextElement.module.css";

export type TextElementProps = {
  isSelected: boolean;
  options: TextOptions;
  position: Point;
  onMouseDown: (options: TextOptions) => void;
  onBlur: (isEmpty: boolean) => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  const handleMouseDown = () => {
    props.onMouseDown(props.options);
  };

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
      <ContentEditable
        isSelected={props.isSelected}
        onBlur={props.onBlur}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
