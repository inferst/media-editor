import { createSignal, For } from "solid-js";
import { TextOptions } from "../../../types/text";
import { useEditorContext } from "../editorContext";
import styles from "./TextEditor.module.css";
import { TextElement } from "./TextElement/TextElement";

type Point = {
  x: number;
  y: number;
};

type TextElement = {
  text: string;
  position: Point;
  options: TextOptions;
};

export const TextEditor = () => {
  const [elements, setElements] = createSignal<TextElement[]>([]);
  const context = useEditorContext("TextEditor");
  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    setElements([
      ...elements(),
      {
        text: "",
        position: { x: 0, y: 0 },
        options: context.state.textOptions(),
      },
    ]);
  };

  return (
    <div class={styles.editor} onMouseDown={handleMouseDown}>
      <For each={elements()}>
        {() => {
          return <TextElement />;
        }}
      </For>
    </div>
  );
};
