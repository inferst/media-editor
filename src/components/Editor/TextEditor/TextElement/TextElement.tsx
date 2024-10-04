import { createClickOutside } from "@/hooks/createOusideClick";
import { Position, Rect, Size, TextOptions } from "@/types";
import { px, stripHtmlTags } from "@/utils";
import clsx from "clsx";
import {
  Component,
  createEffect,
  createSignal,
  on,
  onMount,
  Show,
} from "solid-js";
import { useEditorContext } from "../../editorContext";
import { ContentEditable } from "./ContentEditable/ContentEditable";
import { SVGFilter } from "./SVGFilter/SVGFilter";
import styles from "./TextElement.module.css";

export type DragStartEvent = {
  offset: Position;
};

export type TextElementProps = {
  isSelected: boolean;
  options: TextOptions;
  position: Position;
  size: Size;
  resizerRef: HTMLDivElement | undefined;
  onMouseDown: (
    event: DragStartEvent,
    options: TextOptions,
    boundingRect: Rect,
  ) => void;
  onBlur: (isEmpty: boolean) => void;
  onRender: (inner: Rect, outer: Rect) => void;
  onMount: (inner: Rect, outer: Rect) => void;
};

export const TextElement: Component<TextElementProps> = (props) => {
  const [isEditable, setIsEditable] = createSignal(true);

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
          // console.log("effect props.position");
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
      // console.log("effect props.size.width", props.size.width);
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
    if (!props.isSelected) {
      props.onMouseDown(
        {
          offset: {
            left: event.offsetX * scale(),
            top: event.offsetY * scale(),
          },
        },
        props.options,
        getOuterRect(),
      );
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
      wrapper &&
      target &&
      textOptionsRef &&
      !textOptionsRef.contains(target) &&
      props.resizerRef &&
      !props.resizerRef.contains(target)
    ) {
      props.onBlur(stripHtmlTags(wrapper.innerHTML) == "");

      setIsEditable(false);
      wrapper.blur();
    }
  });

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
          "font-size": `${props.options.size}px`,
        }}
      >
        <ContentEditable
          isEditable={isEditable()}
          style={props.options.style}
          color={props.options.color}
          onInput={handleInput}
        />
      </div>
      <Show when={props.options.style == "white"}>
        <SVGFilter />
      </Show>
    </div>
  );
};
