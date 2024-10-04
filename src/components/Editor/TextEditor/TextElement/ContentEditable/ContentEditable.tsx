import clsx from "clsx";
import { Component, onMount } from "solid-js";
import { TextStyle } from "../../../../../types/text";
import styles from "./ContentEditable.module.css";

export type ContentEditableProps = {
  isEditable: boolean;
  style: TextStyle;
  color: string;
  onInput: () => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    ref?.focus();
  });

  return (
    <span
      ref={ref}
      spellcheck={false}
      contenteditable={true}
      onInput={() => props.onInput()}
      class={clsx(styles.contenteditable, {
        [styles.edit]: props.isEditable,
      })}
      style={{
        color: props.style == "white" ? "white" : props.color,
        "background-color": props.style == "white" ? props.color : undefined,
        "-webkit-text-stroke-width": props.style == "black" ? "1px" : undefined,
        "-webkit-text-stroke-color": "black",
      }}
    />
  );
};
