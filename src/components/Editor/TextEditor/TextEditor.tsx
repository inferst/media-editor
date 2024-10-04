import { Position, Rect, Size, TextOptions } from "@/types";
import { Key } from "@solid-primitives/keyed";
import clsx from "clsx";
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { useEditorContext } from "../editorContext";
import { Resizer } from "./Resizer/Resizer";
import styles from "./TextEditor.module.css";
import { TextElement } from "./TextElement/TextElement";

type TextElement = {
  id: string;
  position: Position;
  size: Size;
  options: TextOptions;
};

export const TextEditor = () => {
  const [elements, setElements] = createSignal<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = createSignal<
    string | undefined
  >();

  const [isDrag, setIsDrag] = createSignal(false);
  const [offset, setOffset] = createSignal<Position>({ left: 0, top: 0 });

  const [selectedRect, setSelectedRect] = createSignal<Rect | undefined>();

  const isEditable = createMemo(() => selectedElementId() == undefined);
  const isSelected = createMemo(() => selectedElementId() != undefined);

  let editor: HTMLDivElement | undefined;

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
            left: event.offsetX,
            top: event.offsetY,
          },
          size: { width: 0, height: 0 },
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

  const handleElementMouseDown = (
    id: string,
    options: TextOptions,
    offset: Position,
    rect: Rect,
  ) => {
    setSelectedElementId(id);
    context.setTextOptions(options);
    setIsDrag(true);
    setOffset({ left: offset.left, top: offset.top });
    setSelectedRect(rect);
  };

  const handleElementBlur = (id: string, isEmpty: boolean) => {
    if (isEmpty) {
      setElements(
        elements().filter((element) => {
          return element.id != id;
        }),
      );
    }

    if (selectedElementId() == id) {
      setSelectedElementId(undefined);
    }
  };

  const updateElement = (id: string, data: Partial<TextElement>) => {
    setElements(
      elements().map((element) => {
        if (element.id == id) {
          return {
            ...element,
            ...data,
          };
        }

        return element;
      }),
    );
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (editor) {
      const rect = editor.getBoundingClientRect();
      const position = {
        left: event.clientX - rect.left,
        top: event.clientY - rect.top,
      };

      if (isDrag()) {
        setElements(
          elements().map((element) => {
            if (element.id == selectedElementId()) {
              return {
                ...element,
                position: {
                  left: position.left - offset().left,
                  top: position.top - offset().top,
                },
              };
            }

            return element;
          }),
        );
      }
    }
  };

  const [innerSize, setInnerSize] = createSignal<Size>();

  const handleRender = (inner: Rect, outer: Rect) => {
    setSelectedRect(outer);
    setInnerSize(inner);
  };

  const handleMount = (id: string, inner: Rect, outer: Rect) => {
    const updatedRect = {
      ...inner,
      top: inner.top - inner.height / 2,
    };

    setSelectedRect(outer);
    setInnerSize(inner);

    updateElement(id, {
      position: {
        left: updatedRect.left,
        top: updatedRect.top,
      },
    });
  };

  const handleDocumentMouseUp = () => {
    setIsDrag(false);
  };

  onMount(() => {
    document.addEventListener("mouseup", handleDocumentMouseUp);
  });

  onCleanup(() => {
    document.removeEventListener("mouseup", handleDocumentMouseUp);
  });

  const handleResize = (position: Position, size: Size) => {
    const id = selectedElementId();

    // console.log(position, size);

    if (id) {
      updateElement(id, {
        position,
        size,
      });
    }
  };

  const [uiRef, setUiRef] = createSignal<HTMLDivElement | undefined>();

  const resizerPosition = createMemo(() => ({
    left: selectedRect()?.left ?? 0,
    top: selectedRect()?.top ?? 0,
  }));

  const resizerSize = createMemo(() => ({
    width: selectedRect()?.width ?? 0,
    height: selectedRect()?.height ?? 0,
  }));

  const resizerInnerSize = createMemo(() => ({
    width: innerSize()?.width ?? 0,
    height: innerSize()?.height ?? 0,
  }));

  return (
    <div
      ref={editor}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      class={clsx(styles.editor, {
        [styles.editable]: isEditable(),
      })}
    >
      <Key each={elements()} by={(item) => item.id}>
        {(item) => (
          <TextElement
            resizerRef={uiRef()}
            isSelected={selectedElementId() == item().id}
            options={item().options}
            position={item().position}
            size={item().size}
            onMount={(inner, outer) => handleMount(item().id, inner, outer)}
            onRender={(inner, outer) => handleRender(inner, outer)}
            onBlur={(isEmpty) => handleElementBlur(item().id, isEmpty)}
            onMouseDown={(event, options, rect) =>
              handleElementMouseDown(item().id, options, event.offset, rect)
            }
          />
        )}
      </Key>
      <Show when={isSelected()}>
        <Resizer
          setRef={setUiRef}
          position={resizerPosition()}
          size={resizerSize()}
          innerSize={resizerInnerSize()}
          onResize={handleResize}
        />
      </Show>
    </div>
  );
};
