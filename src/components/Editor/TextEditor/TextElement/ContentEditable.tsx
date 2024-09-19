import clsx from "clsx";
import { Component, onMount } from "solid-js";
import styles from "./ContentEditable.module.css";
import { TextStyle } from "../../../../types/text";

export type ContentEditableProps = {
  isEditable: boolean;
  style: TextStyle,
  color: string,
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  let divRef: HTMLDivElement | undefined;

  onMount(() => {
    divRef?.focus();
  });

  return (
    <span
      ref={divRef}
      spellcheck={false}
      contenteditable={true}
      class={clsx(styles.contenteditable, {
        [styles.edit]: props.isEditable,
      })}
      style={{
        color: props.style == 'white' ? 'white' : props.color,
        "background-color": props.style == 'white' ? props.color : undefined,
        "-webkit-text-stroke-width": props.style == 'black' ? '1px' : undefined,
        "-webkit-text-stroke-color": "black",
      }}
    />
  );
};
