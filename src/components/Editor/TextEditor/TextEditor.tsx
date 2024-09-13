import { Key } from "@solid-primitives/keyed";
import { createEffect, createSignal, on } from "solid-js";
import { Point } from "../../../types/editor";
import { TextOptions } from "../../../types/text";
import { useEditorContext } from "../editorContext";
import styles from "./TextEditor.module.css";
import { TextElement } from "./TextElement/TextElement";

type TextElement = {
  id: number;
  position: Point;
  options: TextOptions;
};

export const TextEditor = () => {
  const [elements, setElements] = createSignal<TextElement[]>([]);
  const [focusedElement, setFocusedElement] = createSignal();

  const context = useEditorContext("TextEditor");

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    setElements([
      ...elements(),
      {
        id: elements().length,
        position: {
          x: event.offsetX,
          y: event.offsetY,
        },
        options: context.state.textOptions(),
      },
    ]);
  };

  createEffect(
    on(context.state.textOptions, () => {
      setElements(
        elements().map((element) => {
          if (element.id == focusedElement()) {
            return {
              ...element,
              options: context.state.textOptions(),
            };
          }

          return element;
        }),
      );
    }),
  );

  // const textElements = createMemo(() => {
  //   return elements().map((element) => {
  //     if (element.id == focusedElement()) {
  //       return {
  //         ...element,
  //         options: context.state.textOptions(),
  //       };
  //     }
  //
  //     return element;
  //   });
  // });

  const handleElementFocus = (id: number) => {
    setFocusedElement(id);
  };

  return (
    <div onMouseDown={handleMouseDown} class={styles.editor}>
      <Key each={elements()} by={(item) => item.id}>
        {(item) => (
          <TextElement
            options={item().options}
            position={item().position}
            onFocus={() => handleElementFocus(item().id)}
          />
        )}
      </Key>
    </div>
  );
};
