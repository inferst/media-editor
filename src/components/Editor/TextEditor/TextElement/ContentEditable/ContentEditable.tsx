import { TextStyle } from "@/types";
import clsx from "clsx";
import { Component, onMount } from "solid-js";
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

  const handleMouseDown = (event: MouseEvent) => {
    if (!props.isEditable) {
      event.preventDefault();
    }
  };

  return (
    <span
      ref={ref}
      spellcheck={false}
      contenteditable={props.isEditable}
      onInput={() => props.onInput()}
      onMouseDown={handleMouseDown}
      class={clsx(styles.contenteditable, {
        [styles.edit]: props.isEditable,
      })}
      style={{
        display: "inline",
        border: "none",
        outline: "none",
        color: props.style == "white" ? "white" : props.color,
        filter: props.style == "white" ? 'url("#round")' : "none",
        padding: "0 6px",
        "background-color": props.style == "white" ? props.color : undefined,
        "-webkit-text-stroke-width": props.style == "black" ? "1px" : undefined,
        "-webkit-text-stroke-color": "black",
        "-webkit-box-decoration-break": "clone",
        "box-decoration-break": "clone",
      }}
    />
  );
};
