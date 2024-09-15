import { createEffect, createSignal, onCleanup } from "solid-js";

export const createClickOutside = <T extends HTMLElement>(
  onClick: (event: MouseEvent) => void,
) => {
  const [ref, setRef] = createSignal<T>();

  const onMouseDown = (event: MouseEvent) => {
    const element = ref() as HTMLElement;
    const target = event.target as HTMLElement;

    if (element && target && !element.contains(target)) {
      onClick(event);
    }
  };

  createEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    onCleanup(() => {
      document.removeEventListener("mousedown", onMouseDown);
    });
  });

  return { setRef };
};
