import clsx from "clsx";
import { Component, createMemo, createSignal, onMount, Show } from "solid-js";
import { createClickOutside } from "../../../../hooks/createOusideClick";
import { Point } from "../../../../types/editor";
import { TextOptions } from "../../../../types/text";
import { stripHtmlTags } from "../../../../utils/html";
import { useEditorContext } from "../../editorContext";
import { ContentEditable } from "./ContentEditable";
import { SVGFilter } from "./SVGFilter";
import styles from "./TextElement.module.css";

export type TextElementProps = {
  isSelected: boolean;
  options: TextOptions;
  position: Point;
  onMouseDown: (options: TextOptions) => void;
  onBlur: (isEmpty: boolean) => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  const [offsetY, setOffsetY] = createSignal(0);
  const [isEditable, setIsEditable] = createSignal(true);

  let divRef: HTMLDivElement | undefined;

  const context = useEditorContext("TextElement");

  onMount(() => {
    const element = divRef;

    if (element) {
      setOffsetY(-element.offsetHeight / 2);
    }
  });

  const x = createMemo(() => props.position.x);
  const y = createMemo(() => props.position.y + offsetY());

  const handleMouseDown = (event: MouseEvent) => {
    if (!props.isSelected) {
      props.onMouseDown(props.options);
      event.preventDefault();
    } else {
      setIsEditable(true);
    }

    event.stopPropagation();
  };

  const { setRef } = createClickOutside((event) => {
    const target = event.target as HTMLElement;
    const textOptionsRef = context.state.textOptionsRef();

    if (
      divRef &&
      target &&
      textOptionsRef &&
      !textOptionsRef.contains(target)
    ) {
      if (props.isSelected) {
        props.onBlur(stripHtmlTags(divRef.innerHTML) == "");
      }

      setIsEditable(false);
      divRef.blur();
    }
  });

  return (
    <div
      ref={(ref) => {
        divRef = ref;
        setRef(ref);
      }}
      onMouseDown={handleMouseDown}
      class={clsx(styles.element, {
        [styles.selected]: props.isSelected,
        [styles.edit]: isEditable(),
      })}
      style={{
        left: `${x()}px`,
        top: `${y()}px`,
        "text-align": props.options.alignment,
        "font-family": props.options.font,
        "font-size": `${props.options.size}px`,
      }}
    >
      <ContentEditable
        isEditable={isEditable()}
        style={props.options.style}
        color={props.options.color}
      />
      <Show when={props.options.style == "white"}>
        <SVGFilter />
      </Show>
    </div>
  );
};
