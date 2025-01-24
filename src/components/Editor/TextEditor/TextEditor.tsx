import { Position, Rect, Size, TextElementOptions, TextOptions } from "@/types";
import { Key } from "@solid-primitives/keyed";
import clsx from "clsx";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  Setter,
  Show,
} from "solid-js";
import { useEditorContext } from "../editorContext";
import { Resizer } from "./Resizer/Resizer";
import styles from "./TextEditor.module.css";
import { TextElement } from "./TextElement/TextElement";

export type TextEditorProps = {
  isDisabled: boolean;
  setRef: Setter<HTMLDivElement | undefined>;
};

export const TextEditor: Component<TextEditorProps> = (props) => {
  const [selectedElementId, setSelectedElementId] = createSignal<
    string | undefined
  >();

  const [offset, setOffset] = createSignal<Position>({ left: 0, top: 0 });

  const [selectedRect, setSelectedRect] = createSignal<Rect | undefined>();

  const [innerSize, setInnerSize] = createSignal<Size>();

  const [isDragged, setIsDragged] = createSignal(false);

  const [uiRef, setUiRef] = createSignal<HTMLDivElement | undefined>();

  const isSelected = createMemo(() => selectedElementId() != undefined);

  let isDragging = false;

  let editor: HTMLDivElement | undefined;

  const state = useEditorContext("TextEditor").text;

  createEffect(
    on(state.textOptions, () => {
      const id = selectedElementId();
      if (id) {
        updateElement(id, {
          options: state.textOptions(),
        });
      }
    }),
  );

  onMount(() => {
    document.addEventListener("mouseup", handleDocumentMouseUp);
  });

  onCleanup(() => {
    document.removeEventListener("mouseup", handleDocumentMouseUp);
  });

  const handleMouseDown = (event: MouseEvent) => {
    if (!isSelected() && !props.isDisabled) {
      event.preventDefault();

      const id = crypto.randomUUID();

      state.setTextElements([
        ...state.textElements(),
        {
          id,
          position: {
            left: event.offsetX,
            top: event.offsetY,
          },
          size: { width: 0, height: 0 },
          options: state.textOptions(),
        },
      ]);

      setSelectedElementId(id);
    }
  };

  const handleElementMouseDown = (
    id: string,
    options: TextOptions,
    offset: Position,
    rect: Rect,
  ) => {
    if (props.isDisabled) {
      return;
    }

    setSelectedElementId(id);
    state.setTextOptions(options);
    isDragging = true;
    setOffset(offset);
    setSelectedRect(rect);

    console.log("handleElementMouseDown", isDragging);
  };

  const handleElementBlur = (id: string, content: string) => {
    console.log("handleElementBlur", id, content == "");

    if (content == "") {
      state.setTextElements(
        state.textElements().filter((element) => {
          return element.id != id;
        }),
      );
    }

    if (selectedElementId() == id) {
      setSelectedElementId(undefined);
    }
  };

  const updateElement = (id: string, data: Partial<TextElementOptions>) => {
    state.setTextElements(
      state.textElements().map((element) => {
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
    if (isDragging && !props.isDisabled && editor) {
      const id = selectedElementId();

      if (id) {
        const rect = editor.getBoundingClientRect();
        const position = {
          left: event.clientX - rect.left,
          top: event.clientY - rect.top,
        };

        if (!isDragged()) {
          setIsDragged(true);
        }

        updateElement(id, {
          position: {
            left: position.left - offset().left,
            top: position.top - offset().top,
          },
        });
      }
    }
  };

  const handleRender = (inner: Rect, outer: Rect) => {
    console.log("handleRender");
    setSelectedRect(outer);
    setInnerSize(inner);

    // Prevent auto scrolling when typing outside editor bounds
    if (editor) {
      requestAnimationFrame(() => {
        if (editor) {
          editor.scrollTop = 0;
          editor.scrollLeft = 0;
        }
      });
    }
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
    isDragging = false;
    setIsDragged(false);
  };

  const handleResize = (position: Position, size: Size) => {
    console.log("handleResize");

    const id = selectedElementId();

    if (id) {
      updateElement(id, {
        position,
        size,
      });
    }
  };

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
      ref={(ref) => {
        editor = ref;
        props.setRef(ref);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      class={clsx(styles.editor, {
        [styles.editable]: !isSelected() && !props.isDisabled,
      })}
    >
      <Key each={state.textElements()} by={(item) => item.id}>
        {(item) => (
          <TextElement
            resizerRef={uiRef()}
            isSelected={selectedElementId() == item().id}
            isDisabled={props.isDisabled}
            isDragged={isDragged()}
            options={item().options}
            position={item().position}
            size={item().size}
            onMount={(inner, outer) => handleMount(item().id, inner, outer)}
            onRender={(inner, outer) => handleRender(inner, outer)}
            onBlur={(content) => handleElementBlur(item().id, content)}
            onMouseDown={(offset, options, rect) =>
              handleElementMouseDown(item().id, options, offset, rect)
            }
          />
        )}
      </Key>
      <Show when={isSelected() && !props.isDisabled}>
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
