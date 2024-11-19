import { Position, Rect, Size, TextOptions } from "@/types";
import { px, setCaretPosition } from "@/utils";
import clsx from "clsx";
import { Component, createEffect, createSignal, on, onMount } from "solid-js";
import { useEditorContext } from "../../editorContext";
import { ContentEditable } from "../ContentEditable/ContentEditable";
import styles from "./TextElement.module.css";

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
  onBlur: (content: string) => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);
  const [isSecondClick, setIsSecondClick] = createSignal(false);
  const [scale, setScale] = createSignal(1);
  const [content, setContent] = createSignal("");

  let wrapper: HTMLDivElement;
  let element: HTMLDivElement;

  const state = useEditorContext("TextElement").text;

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
    if (value != props.size.width && props.size.width > 0) {
      const width = wrapper.offsetWidth;
      setScale(props.size.width / width);
    }

    return props.size.width;
  }, 0);

  const getInnerRect = () => {
    return {
      left: wrapper.offsetLeft,
      top: wrapper.offsetTop,
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
    };
  };

  const getOuterRect = () => {
    const rect = element.getBoundingClientRect();

    return {
      left: wrapper.offsetLeft,
      top: wrapper.offsetTop,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleInput = (content: string) => {
    props.onRender(getInnerRect(), getOuterRect());
    setContent(content);
  };

  const handleClickOutside = (target: HTMLElement, content: string) => {
    const textOptionsRef = state.textOptionsRef();

    if (
      textOptionsRef &&
      !textOptionsRef.contains(target) &&
      props.resizerRef &&
      !props.resizerRef.contains(target)
    ) {
      props.onBlur(content);
      setIsEditable(false);
      setIsSecondClick(false);
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (props.isDisabled) {
      return;
    }

    if (!isEditable()) {
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

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key == "Escape") {
      props.onBlur(content());
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
      setCaretPosition(event.clientX, event.clientY);
    }
  };

  return (
    <div
      ref={(ref) => {
        wrapper = ref;
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
        ref={(ref) => {
          element = ref;
        }}
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
          edit={isEditable()}
          style={props.options.style}
          color={props.options.color}
          onInput={handleInput}
          onClickOutside={handleClickOutside}
        />
      </div>
    </div>
  );
};
