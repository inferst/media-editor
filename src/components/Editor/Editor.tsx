import {
  EditorType,
  MessageData,
  TextElementOptions,
  TextOptions,
} from "@/types";
import { createSignal, Show } from "solid-js";
import EditorWorker from "../../workers/editorWorker?worker";
import { getDefaultTextOptions } from "../content/Text/textOptions";
import { Sidebar } from "../Sidebar/Sidebar";
import BrowseFile from "./BrowseFile";
import { download } from "./download/download";
import { DownloadButton } from "./DownloadButton/DownloadButton";
import styles from "./Editor.module.css";
import { EditorContext, EditorContextValue, ImageState } from "./editorContext";
import { SVGFilter } from "./TextEditor/SVGFilter/SVGFilter";
import { TextEditor } from "./TextEditor/TextEditor";

const editorWorker = new EditorWorker();

const postMessage = (data: MessageData, transfer?: Transferable[]) => {
  editorWorker.postMessage(data, transfer ?? []);
};

export function Editor() {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [editorType, setEditorType] = createSignal<EditorType>("enhance");
  const [imageState, setImageState] = createSignal<ImageState>({
    width: 0,
    height: 0,
  });
  const [textOptionsRef, setTextOptionsRef] = createSignal<HTMLElement>();
  const [textOptions, setTextOptions] = createSignal<TextOptions>(
    getDefaultTextOptions(),
  );

  const [textElements, setTextElements] = createSignal<TextElementOptions[]>(
    [],
  );

  let canvasRef: HTMLCanvasElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let offscreen: OffscreenCanvas | undefined;

  const onBrightnessChange = (value: number) => {
    console.log(value);
  };

  const onContrastChange = (value: number) => {
    postMessage({
      contrast: (value + 150) / 200,
    });
  };

  const onVignetteChange = (value: number) => {
    postMessage({
      vignette: value / 100,
    });
  };

  const onShadowsChange = (value: number) => {
    postMessage({
      shadows: (value + 100) / 100,
    });
  };

  const onFadeChange = (value: number) => {
    postMessage({
      fade: value / 100,
    });
  };

  const onGrainChange = (value: number) => {
    postMessage({
      grain: value / 200,
    });
  };

  const onWarmthChange = (value: number) => {
    postMessage({
      warmth: value / 100,
    });
  };

  const onHighlightsChange = (value: number) => {
    postMessage({
      highlights: (value + 100) / 100,
    });
  };

  const onSaturationChange = (value: number) => {
    postMessage({
      saturation: (value + 100) / 100,
    });
  };

  const onEnhanceChange = (value: number) => {
    postMessage({
      enhance: (value - 100) / 100,
    });
  };

  const onEditorTypeChange = (type: EditorType) => {
    setEditorType(type);
  };

  const context: EditorContextValue = {
    editorType,
    onEditorTypeChange,
    image: imageState,
    text: {
      textOptions,
      textOptionsRef,
      textElements,
      setTextOptions,
      setTextElements,
      setTextOptionsRef,
    },
    enhance: {
      onBrightnessChange,
      onContrastChange,
      onVignetteChange,
      onShadowsChange,
      onFadeChange,
      onGrainChange,
      onWarmthChange,
      onHighlightsChange,
      onSaturationChange,
      onEnhanceChange,
    },
  };

  const handleLoad = (bitmap: ImageBitmap) => {
    setIsLoaded(true);

    if (canvasRef) {
      canvasRef.width = bitmap.width;
      canvasRef.height = bitmap.height;
      offscreen = canvasRef.transferControlToOffscreen();
      postMessage({ canvas: offscreen, bitmap }, [offscreen]);
      setImageState({
        width: bitmap.width,
        height: bitmap.height,
      });
    }
  };

  const handleDownloadButtonClick = async () => {
    const textEditor = textEditorRef();

    if (textEditor && canvasRef) {
      const fragment = textEditor.outerHTML;
      const fonts = new Set(
        textElements().map((element) => element.options.font),
      );
      download(canvasRef, fragment, Array.from(fonts));
    }
  };

  const [textEditorRef, setTextEditorRef] = createSignal<HTMLDivElement>();

  return (
    <EditorContext.Provider value={context}>
      <div class={styles.editor}>
        <div ref={containerRef} class={styles.container}>
          <Show when={isLoaded()} fallback={<BrowseFile onLoad={handleLoad} />}>
            <canvas ref={canvasRef} class={styles.canvas} />
            <TextEditor
              setRef={setTextEditorRef}
              isDisabled={editorType() !== "text"}
            />
            <SVGFilter />
          </Show>
        </div>
        <Sidebar />
      </div>
      <DownloadButton onClick={handleDownloadButtonClick} />
    </EditorContext.Provider>
  );
}
