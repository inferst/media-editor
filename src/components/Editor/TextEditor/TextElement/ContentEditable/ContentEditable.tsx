import { TextStyle } from "@/types";
import {
  generateStyle,
  getCursorPosition,
  setCursorPosition,
  stripHtmlTags,
} from "@/utils";
import clsx from "clsx";
import { Component, createMemo, createSignal, onMount } from "solid-js";
import styles from "./ContentEditable.module.css";

export type ContentEditableProps = {
  isEditable: boolean;
  style: TextStyle;
  color: string;
  onInput: () => void;
  setRef: (ref: HTMLDivElement) => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [id, setId] = createSignal("");

  let divRef: HTMLDivElement | undefined;

  // const selectElement = (element?: HTMLElement) => {
  //   const select = document.getSelection();
  //
  //   if (select && element) {
  //     const range = document.createRange();
  //     range.selectNodeContents(element);
  //     range.collapse();
  //     select.removeAllRanges();
  //     select.addRange(range);
  //     element.focus();
  //   }
  // };

  const createElement = (content?: string): HTMLElement => {
    const span = document.createElement("span");
    const p = document.createElement("p");
    // &#xFEFF; is zero width empty symbol (Chrome fix)
    span.innerHTML = content || "&#xFEFF;";
    p.appendChild(span);

    if (divRef) {
      divRef.innerHTML = "";
      divRef.appendChild(p);
    }

    return span;
  };

  // When user select all span tag can be deleted
  const restoreParagraph = () => {
    const children = divRef!.children;
    let position = getCursorPosition(divRef!);

    for (const pElement of children) {
      const length = pElement.childNodes.length;

      if (length != 1 || !pElement.querySelector("span")) {
        const content = stripHtmlTags(pElement.innerHTML).trim();
        const span = document.createElement("span");
        span.innerHTML = content || "&#xFEFF;";
        pElement.innerHTML = "";
        pElement.appendChild(span);

        if (position >= 0 && position <= content.length) {
          setCursorPosition(span.firstChild!, position);
        }
      } else {
        const span = pElement.querySelector("span");
        position = position - (span?.textContent || "").length;
      }
    }

    if (divRef && !divRef.querySelector("span")) {
      const content = stripHtmlTags(divRef.innerHTML).trim();
      const element = createElement(content);
      setCursorPosition(element, 0);
    }
  };

  onMount(() => {
    setId("id-" + crypto.randomUUID());

    const element = createElement();
    setCursorPosition(element, 0);
  });

  const handleInput = () => {
    restoreParagraph();
    props.onInput();
  };

  const style = createMemo(() =>
    generateStyle({
      [`#${id()} span`]: {
        "background-color": props.style == "white" ? props.color : undefined,
        "-webkit-text-stroke-width": props.style == "black" ? "2px" : undefined,
      },
    }),
  );

  return (
    <>
      <style innerText={style()} />
      <div
        ref={(ref) => {
          divRef = ref;
          props.setRef(ref);
        }}
        id={id()}
        tabindex={-1}
        spellcheck={false}
        contenteditable={props.isEditable}
        onInput={handleInput}
        class={clsx(styles.contenteditable, {
          [styles.editable]: props.isEditable,
        })}
        style={{
          filter: props.style == "white" ? 'url("#round")' : "none",
          color: props.style == "white" ? "white" : props.color,
        }}
      />
    </>
  );
};
