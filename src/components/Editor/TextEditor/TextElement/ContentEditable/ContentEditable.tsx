import { TextStyle } from "@/types";
import clsx from "clsx";
import { Component, createMemo, createSignal, onMount } from "solid-js";
import styles from "./ContentEditable.module.css";
import { generateStyle, stripHtmlTags } from "@/utils";

export type ContentEditableProps = {
  isEditable: boolean;
  style: TextStyle;
  color: string;
  onInput: () => void;
  setRef: (ref: HTMLDivElement) => void;
};

export const ContentEditable: Component<ContentEditableProps> = (props) => {
  const [id, setId] = createSignal("");

  let pRef: HTMLParagraphElement | undefined;
  let divRef: HTMLDivElement | undefined;

  const selectParagraph = () => {
    const select = document.getSelection();
    const range = document.createRange();

    if (select && pRef) {
      range.selectNodeContents(pRef);
      range.collapse();
      select.removeAllRanges();
      select.addRange(range);
      pRef.focus();
    }
  };

  const createParagraph = (content?: string) => {
    if (divRef) {
      const div = document.createElement("div");
      pRef = document.createElement("p");
      pRef.innerHTML = content || "&#xFEFF;"; // Chrome fix
      div.appendChild(pRef);
      divRef.innerHTML = "";
      divRef.appendChild(div);
    }
  };

  const restoreParagraph = () => {
    if (pRef && divRef && !divRef.querySelector("p")) {
      const content = stripHtmlTags(divRef.innerHTML).trim();
      createParagraph(content);
      selectParagraph();
    }
  };

  onMount(() => {
    setId("id-" + crypto.randomUUID());

    createParagraph();
    selectParagraph();
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (!props.isEditable) {
      event.preventDefault();
    }
  };

  const handleInput = () => {
    restoreParagraph();
    props.onInput();
  };

  const style = createMemo(() =>
    generateStyle({
      [`#${id()} p`]: {
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
        spellcheck={false}
        contenteditable={props.isEditable}
        onInput={handleInput}
        onMouseDown={handleMouseDown}
        class={clsx(styles.contenteditable, {
          [styles.edit]: props.isEditable,
        })}
        style={{
          filter: props.style == "white" ? 'url("#round")' : "none",
          color: props.style == "white" ? "white" : props.color,
        }}
      />
    </>
  );
};
