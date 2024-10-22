import { Position, Size } from "@/types/editor";
import { px } from "@/utils/styles";
import clsx from "clsx";
import { Component, createMemo, createSignal, Setter } from "solid-js";
import styles from "./Resizer.module.css";

export type ResizeButtonPosition =
  | "left-top"
  | "right-top"
  | "left-bottom"
  | "right-bottom";

export type ResizerProps = {
  position: Position;
  size: Size;
  innerSize: Size;
  setRef: Setter<HTMLDivElement | undefined>;
  onResize: (position: Position, size: Size) => void;
};

export const Resizer: Component<ResizerProps> = (props) => {
  const [currentResizeButton, setCurrentResizeButton] =
    createSignal<ResizeButtonPosition>("left-top");

  const [cursorPosition, setCursorPosition] = createSignal<Position>({
    left: 0,
    top: 0,
  });

  const [initialPosition, setInitialPosition] = createSignal<Position>({
    left: 0,
    top: 0,
  });

  const [initialSize, setInitialSize] = createSignal<Size>({
    width: 0,
    height: 0,
  });

  const bindEvents = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const unbindEvents = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (event: MouseEvent, button: ResizeButtonPosition) => {
    event.preventDefault();
    event.stopPropagation();

    bindEvents();

    setCurrentResizeButton(button);

    setCursorPosition({
      left: event.clientX,
      top: event.clientY,
    });

    setInitialPosition({
      left: props.position.left,
      top: props.position.top,
    });

    setInitialSize({
      width: props.size.width,
      height: props.size.height,
    });
  };

  const handleMouseUp = () => {
    unbindEvents();
  };

  const ratio = createMemo(
    () => props.innerSize.width / props.innerSize.height,
  );

  const handleMouseMove = (event: MouseEvent) => {
    const resizeButton = currentResizeButton();
    const cursor = cursorPosition();
    const iPosition = initialPosition();
    const iSize = initialSize();
    const position = { ...props.position };
    const size = { ...props.size };

    const diff = {
      left: cursor.left - event.clientX,
      top: cursor.top - event.clientY,
    };

    switch (resizeButton) {
      case "left-top": {
        const left = iPosition.left - diff.left;
        const top = iPosition.top - diff.left / ratio();

        if (
          left <= iPosition.left + iSize.width &&
          top <= iPosition.top + iSize.height
        ) {
          position.left = left;
          position.top = top;
        }

        size.width = iSize.width + diff.left;
        break;
      }
      case "right-top": {
        const top = iPosition.top + diff.left / ratio();

        if (top <= iPosition.top + iSize.height) {
          position.top = top;
        }

        size.width = iSize.width - diff.left;
        break;
      }
      case "left-bottom": {
        const left = iPosition.left - diff.left;

        if (left <= iPosition.left + iSize.width) {
          position.left = left;
        }

        size.width = iSize.width + diff.left;
        break;
      }
      case "right-bottom": {
        size.width = iSize.width - diff.left;
        break;
      }
    }

    props.onResize(position, size);
  };

  const left = () => px(props.position.left);
  const top = () => px(props.position.top);
  const width = () => px(props.size.width);
  const height = () => px(props.size.height);

  return (
    <div
      ref={props.setRef}
      class={styles.resizer}
      style={{
        left: left(),
        top: top(),
        width: width(),
        height: height(),
      }}
    >
      <div
        onMouseDown={(event) => handleMouseDown(event, "left-top")}
        class={clsx(styles["resize-button"], styles["left-top"])}
      />
      <div
        onMouseDown={(event) => handleMouseDown(event, "right-top")}
        class={clsx(styles["resize-button"], styles["right-top"])}
      />
      <div
        onMouseDown={(event) => handleMouseDown(event, "left-bottom")}
        class={clsx(styles["resize-button"], styles["left-bottom"])}
      />
      <div
        onMouseDown={(event) => handleMouseDown(event, "right-bottom")}
        class={clsx(styles["resize-button"], styles["right-bottom"])}
      />
    </div>
  );
};
