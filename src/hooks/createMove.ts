import { createEffect, createSignal, onCleanup } from "solid-js";

export type Point = {
  x: number;
  y: number;
};

export const createMove = <T extends HTMLElement>(
  onChange: (position: Point) => void,
) => {
  const [ref, setRef] = createSignal<T>();
  const [isActive, setIsActive] = createSignal(false);

  const onMouseMove = (event: MouseEvent) => {
    const element = ref();
    if (element) {
      const rect = element.getBoundingClientRect();
      const position = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
      onChange({
        x: Math.min(Math.max(position.x, 0), 1),
        y: Math.min(Math.max(position.y, 0), 1),
      });
    }
  };

  const onMouseUp = () => {
    unbindEvents();
  };

  const bindEvents = () => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const unbindEvents = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    onMouseMove(event);
    bindEvents();
    setIsActive(true);
  };

  createEffect(() => {
    const element = ref();
    if (element) {
      element.addEventListener("mousedown", onMouseDown);
      onCleanup(() => {
        element.removeEventListener("mousedown", onMouseDown);
      });
    }
  });

  return { setRef, isActive };
};
