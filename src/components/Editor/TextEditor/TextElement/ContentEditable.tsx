import clsx from "clsx";
import { Component, createSignal, onMount } from "solid-js";
import { createClickOutside } from "../../../../hooks/createOusideClick";
import { stripHtmlTags } from "../../../../utils/html";
import styles from "./ContentEditable.module.css";

export type ContentEditableProps = {
  isSelected: boolean;
  onMouseDown: () => void;
  onBlur: (isEmpty: boolean) => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);

  let divRef: HTMLDivElement | undefined;

  const { setRef } = createClickOutside(() => {
    if (divRef) {
      if (props.isSelected) {
        props.onBlur(stripHtmlTags(divRef.innerHTML) == "");
      }

      setIsEditable(false);
      divRef.blur();
    }
  });

  onMount(() => {
    divRef?.focus();
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (!props.isSelected) {
      event.preventDefault();
    } else {
      setIsEditable(true);
    }

    event.stopPropagation();
    props.onMouseDown();
  };

  return (
    <div
      ref={(ref) => {
        divRef = ref;
        setRef(ref);
      }}
      onMouseDown={handleMouseDown}
      spellcheck={false}
      contenteditable={true}
      class={clsx(styles.contenteditable, {
        [styles.selected]: props.isSelected,
        [styles.edit]: isEditable(),
      })}
    >
      {" "}
    </div>
  );
};
