import clsx from "clsx";
import { Component, createSignal, onMount } from "solid-js";
import { createClickOutside } from "../../../../hooks/createOusideClick";
import { stripHtmlTags } from "../../../../utils/html";
import styles from "./ContentEditable.module.css";
import { useEditorContext } from "../../editorContext";

export type ContentEditableProps = {
  isSelected: boolean;
  onMouseDown: () => void;
  onBlur: (isEmpty: boolean) => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);

  const context = useEditorContext("ContentEditable");

  let divRef: HTMLDivElement | undefined;

  const { setRef } = createClickOutside((event) => {
    const target = event.target as HTMLElement;
    console.log(target);

    if (divRef && target && !context.state.textOptionsRef()?.contains(target)) {
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
