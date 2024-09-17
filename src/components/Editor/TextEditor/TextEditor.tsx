import { Key } from "@solid-primitives/keyed";
import clsx from "clsx";
import { createEffect, createMemo, createSignal, on } from "solid-js";
import { Point } from "../../../types/editor";
import { TextOptions } from "../../../types/text";
import { useEditorContext } from "../editorContext";
import styles from "./TextEditor.module.css";
import { TextElement } from "./TextElement/TextElement";

type TextElement = {
  id: string;
  position: Point;
  options: TextOptions;
};

export const TextEditor = () => {
  const [elements, setElements] = createSignal<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = createSignal<
    string | undefined
  >();

  const isEditable = createMemo(() => selectedElementId() == undefined);

  const context = useEditorContext("TextEditor");

  const handleMouseDown = (event: MouseEvent) => {
    if (isEditable()) {
      event.preventDefault();

      const id = crypto.randomUUID();

      setElements([
        ...elements(),
        {
          id,
          position: {
            x: event.offsetX,
            y: event.offsetY,
          },
          options: context.state.textOptions(),
        },
      ]);

      setSelectedElementId(id);
    }
  };

  createEffect(
    on(context.state.textOptions, () => {
      setElements(
        elements().map((element) => {
          if (element.id == selectedElementId()) {
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

  const handleElementMouseDown = (id: string, options: TextOptions) => {
    setSelectedElementId(id);
    context.setTextOptions(options);
  };

  const handleElementBlur = (id: string, isEmpty: boolean) => {
    if (isEmpty) {
      setElements(
        elements().filter((element) => {
          return element.id != id;
        }),
      );
    }

    setSelectedElementId(undefined);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      class={clsx(styles.editor, {
        [styles.editable]: isEditable(),
      })}
    >
      <Key each={elements()} by={(item) => item.id}>
        {(item) => (
          <TextElement
            isSelected={selectedElementId() == item().id}
            options={item().options}
            position={item().position}
            onMouseDown={(options) => handleElementMouseDown(item().id, options)}
            onBlur={(isEmpty) => handleElementBlur(item().id, isEmpty)}
          />
        )}
      </Key>
    </div>
  );
};
