import { Component, onMount } from "solid-js";

export type ContentEditableProps = {
  onFocus: () => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  let divRef: HTMLDivElement | undefined;

  onMount(() => {
    divRef?.focus();
  });

  const handleMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onFocus={() => props.onFocus()}
      spellcheck={false}
      ref={divRef}
      contenteditable={true}
    >
      {" "}
    </div>
  );
};
