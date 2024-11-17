import { createClickOutside } from "@/hooks/createOusideClick";
import { Position, Rect, Size, TextOptions } from "@/types";
import { hsvToHex, px, stripHtmlTags } from "@/utils";
import clsx from "clsx";
import { Component, createEffect, createSignal, on, onMount } from "solid-js";
import { useEditorContext } from "../../editorContext";
import { ContentEditable } from "./ContentEditable/ContentEditable";
import styles from "./TextElement.module.css";

export type TextElementProps = {
  isSelected: boolean;
  isDisabled: boolean;
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

  const [editableRef, setEditableRef] = createSignal<HTMLDivElement>();

  let wrapper: HTMLDivElement | undefined;
  let element: HTMLDivElement | undefined;

  const context = useEditorContext("TextElement");

  const [scale, setScale] = createSignal(1);

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

    if (!props.isSelected && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();

      const offset = {
        left: event.clientX - wrapperRect.left,
        top: event.clientY - wrapperRect.top,
      };

      props.onMouseDown(offset, props.options, getOuterRect());
      event.preventDefault();
    } else {
      setIsEditable(true);
    }

    event.stopPropagation();
  };

  const { setRef } = createClickOutside((event) => {
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
      // wrapper.blur();
    }
  });

  const handleContentEditableRef = (ref: HTMLDivElement) => {
    setEditableRef(ref);
  };

  return (
    <div
      ref={(ref) => {
        wrapper = ref;
        setRef(ref);
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
        onMouseDown={handleMouseDown}
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
