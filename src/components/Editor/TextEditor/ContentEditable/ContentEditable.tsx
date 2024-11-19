import { createClickOutside } from "@/hooks/createOusideClick";
import { TextStyle } from "@/types";
import {
  generateStyle,
  getCursorPosition,
  HsvObject,
  hsvToHex,
  setCursorPosition,
  stripHtmlTags,
} from "@/utils";
import clsx from "clsx";
import { Component, createMemo, createSignal, onMount } from "solid-js";
import styles from "./ContentEditable.module.css";

export type ContentEditableProps = {
  edit: boolean;
  style: TextStyle;
  color: HsvObject;
  onInput: (content: string) => void;
  onClickOutside: (target: HTMLElement, content: string) => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [id, setId] = createSignal("");
  const [isEmpty, setIsEmpty] = createSignal(true);

  let container: HTMLDivElement;

  onMount(() => {
    setId("id-" + crypto.randomUUID());

    const p = document.createElement("p");
    const span = appendSpan(p);
    container.appendChild(p);

    setCursorPosition(span, 0);
  });

  const appendSpan = (parent: Element, content?: string) => {
    const span = document.createElement("span");
    // &#xFEFF; is zero width empty symbol (Chrome fix)
    span.innerHTML = content || "&#xFEFF;";
    parent.appendChild(span);

    return span;
  };

  // When user select all span tag can be deleted
  const restoreContentEditable = () => {
    const nodes = container.childNodes;
    let position = getCursorPosition(container);

    for (const node of nodes.values()) {
      const element = node as Element;
      const isParagraph = element.tagName == "P";
      const hasSpan = element.firstElementChild?.tagName == "SPAN";
      const nodesCount = element.childNodes.length;

      const content = getContent(element);

      if (!isParagraph || !hasSpan || nodesCount != 1) {
        const p = document.createElement("p");
        element.replaceWith(p);

        const span = appendSpan(p, content);

        if (position >= 0 && position <= content.length) {
          setCursorPosition(span.firstChild!, position);
        }
      } else {
        position = position - content.length;
      }
    }
  };

  const { setRef } = createClickOutside((event) => {
    props.onClickOutside(event.target as HTMLElement, getContent(container));
  });

  const handleInput = () => {
    restoreContentEditable();
    const content = getContent(container);
    props.onInput(content);
    setIsEmpty(content == "");
  };

  // Prevent selection if no edit
  const handleMouseDown = (event: MouseEvent) => {
    if (!props.edit) {
      event.preventDefault();
    }
  };

  const getContent = (element: Element) => {
    const content = element.textContent;
    return content ? stripHtmlTags(content).trim() : "";
  };

  const hex = createMemo(() => hsvToHex(props.color));

  const backgroundColor = createMemo(() => {
    return props.style == "white" && !isEmpty() ? hex() : undefined;
  });

  const color = createMemo(() => {
    const computed = props.color.v > 50 && props.color.s < 50 ? "black" : "white";
    return props.style == "white" ? computed : hsvToHex(props.color);
  });

  const filter = createMemo(() => {
    return props.style == "white" && !isEmpty() ? 'url("#round")' : "none";
  });

  const style = createMemo(() =>
    generateStyle({
      [`#${id()} span`]: {
        "background-color": backgroundColor(),
        "-webkit-text-stroke-width": props.style == "black" ? "2px" : undefined,
      },
    }),
  );

  return (
    <>
      <style innerText={style()} />
      <div
        ref={(ref) => {
          container = ref;
          setRef(ref);
        }}
        id={id()}
        tabindex={-1}
        spellcheck={false}
        contenteditable={props.edit}
        onInput={handleInput}
        onMouseDown={handleMouseDown}
        class={clsx(styles.contenteditable, {
          [styles.edit]: props.edit,
        })}
        style={{
          filter: filter(),
          color: color(),
        }}
      />
    </>
  );
};
