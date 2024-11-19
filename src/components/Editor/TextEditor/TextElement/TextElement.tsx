import { createClickOutside } from "@/hooks/createOusideClick";
import { Position, Rect, Size, TextOptions } from "@/types";
import { hsvToHex, px, setCaretPosition, stripHtmlTags } from "@/utils";
import clsx from "clsx";
import { Component, createEffect, createSignal, on, onMount } from "solid-js";
import { useEditorContext } from "../../editorContext";
import { ContentEditable } from "./ContentEditable/ContentEditable";
import styles from "./TextElement.module.css";

type mode = "selected" | "focused" | "edited";

export type TextElementProps = {
  isSelected: boolean;
  isDisabled: boolean;
  isDragged: boolean;
  options: TextOptions;
  position: Position;
  size: Size;
  resizerRef: HTMLDivElement | undefined;
  onMouseDown: (
    offset: Position,
    options: TextOptions,
    boundingRect: Rect,
  ) => void;
  onRender: (inner: Rect, outer: Rect) => void;
  onMount: (inner: Rect, outer: Rect) => void;
  onBlur: (isEmpty: boolean) => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);
  const [isSecondClick, setIsSecondClick] = createSignal(false);
  const [editableRef, setEditableRef] = createSignal<HTMLDivElement>();
  const [scale, setScale] = createSignal(1);

  let wrapper: HTMLDivElement | undefined;
  let element: HTMLDivElement | undefined;

  const context = useEditorContext("TextElement");

  onMount(() => {
    props.onMount(getInnerRect(), getOuterRect());
  });

  createEffect(
    on(
      () => props.position,
      () => {
        requestAnimationFrame(() => {
          props.onRender(getInnerRect(), getOuterRect());
        });
      },
    ),
  );

  createEffect((value: number) => {
    if (
      element &&
      wrapper &&
      value != props.size.width &&
      props.size.width > 0
    ) {
      const width = wrapper.offsetWidth;
      setScale(props.size.width / width);
    }

    return props.size.width;
  }, 0);

  const getInnerRect = () => {
    if (!wrapper) {
      throw Error("TextElement refs are not initialized");
    }

    return {
      left: wrapper.offsetLeft,
      top: wrapper.offsetTop,
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
    };
  };

  const getOuterRect = () => {
    if (!element || !wrapper) {
      throw Error("TextElement refs are not initialized");
    }

    const rect = element.getBoundingClientRect();

    return {
      left: wrapper.offsetLeft,
      top: wrapper.offsetTop,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleInput = () => {
    props.onRender(getInnerRect(), getOuterRect());
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (props.isDisabled) {
      return;
    }

    element?.focus();

    if (wrapper && !isEditable()) {
      const wrapperRect = wrapper.getBoundingClientRect();

      const offset = {
        left: event.clientX - wrapperRect.left,
        top: event.clientY - wrapperRect.top,
      };

      props.onMouseDown(offset, props.options, getOuterRect());
      event.preventDefault();
    }

    event.stopPropagation();
  };

  const { setRef: setClickOutsideRef } = createClickOutside((event) => {
    const target = event.target as HTMLElement;
    const textOptionsRef = context.state.textOptionsRef();
    const element = editableRef();

    if (
      element &&
      wrapper &&
      target &&
      textOptionsRef &&
      !textOptionsRef.contains(target) &&
      props.resizerRef &&
      !props.resizerRef.contains(target)
    ) {
      props.onBlur(stripHtmlTags(element.innerHTML).trim() == "");
      setIsEditable(false);
      setIsSecondClick(false);
    }
  });

  const handleContentEditableRef = (ref: HTMLDivElement) => {
    setEditableRef(ref);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key == "Escape") {
      const html = editableRef()?.innerHTML ?? "";
      props.onBlur(stripHtmlTags(html).trim() == "");
      setIsEditable(false);
      setIsSecondClick(false);
    }

    event.stopPropagation();
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isSecondClick()) {
      setIsSecondClick(true);
    } else if (props.isSelected && !isEditable() && !props.isDragged) {
      setIsEditable(true);

      const ref = editableRef();

      if (ref) {
        setCaretPosition(ref, event.clientX, event.clientY);
      }
    }
  };

  return (
    <div
      ref={(ref) => {
        wrapper = ref;
        setClickOutsideRef(ref);
      }}
      class={clsx(styles.wrapper, {
        [styles.edit]: isEditable(),
      })}
      style={{
        left: px(props.position.left),
        top: px(props.position.top),
        position: "absolute",
        "line-height": "1.2",
        "z-index": 10,
      }}
    >
      <div
        ref={element}
        tabindex={-1}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        class={styles.element}
        style={{
          scale: scale(),
          "text-align": props.options.alignment,
          "font-family": props.options.font,
          "font-size": `${props.options.size * 2}px`,
          "transform-origin": "top left",
        }}
      >
        <ContentEditable
          isEditable={isEditable()}
          style={props.options.style}
          color={hsvToHex(props.options.color)}
          onInput={handleInput}
          setRef={handleContentEditableRef}
        />
      </div>
    </div>
  );
};
