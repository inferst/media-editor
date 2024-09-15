import clsx from "clsx";
import { Component, createSignal, onCleanup, onMount } from "solid-js";
import styles from "./ContentEditable.module.css";

export type ContentEditableProps = {
  isSelected: boolean;
  onMouseDown: () => void;
  onBlur: (isEmpty: boolean) => void;
};

function stripHtmlTags(html: string) {
  try {
    const stripped = new DOMParser().parseFromString(html, "text/html");
    return stripped.body.textContent || "";
  } catch (error) {
    console.error("Error parsing HTML string:", error);
    return "";
  }
}

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);

  let divRef: HTMLDivElement | undefined;

  const documentMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (divRef && target != divRef) {
      if (props.isSelected) {
        props.onBlur(stripHtmlTags(divRef.innerHTML) == "");
      }

      setIsEditable(false);
      divRef.blur();
    }
  };

  onMount(() => {
    divRef?.focus();
    document.addEventListener("mousedown", documentMouseDown);
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", documentMouseDown);
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
      ref={divRef}
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
