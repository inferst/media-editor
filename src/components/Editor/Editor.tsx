import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { EditorType } from "../../types/editor";
import { TextOptions } from "../../types/text";
import { MessageData } from "../../types/types";
import EditorWorker from "../../workers/editorWorker?worker";
import { getDefaultTextOptions } from "../content/Text/textOptions";
import { Sidebar } from "../Sidebar/Sidebar";
import BrowseFile from "./BrowseFile";
import styles from "./Editor.module.css";
import { EditorContext, EditorContextValue } from "./editorContext";
import { TextEditor } from "./TextEditor/TextEditor";
import { DownloadButton } from "./DownloadButton/DownloadButton";

const editorWorker = new EditorWorker();

const postMessage = (data: MessageData, transfer?: Transferable[]) => {
  editorWorker.postMessage(data, transfer ?? []);
};

export function Editor() {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [editorType, setEditorType] = createSignal<EditorType>("enhance");
  const [textSettingsRef, setTextSettingsRef] = createSignal<
    HTMLElement | undefined
  >();
  const [textOptions, setTextOptions] = createSignal<TextOptions>(
    getDefaultTextOptions(),
  );

  let canvasRef: HTMLCanvasElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let offscreen: OffscreenCanvas | undefined;

  onMount(() => {
    if (canvasRef) {
      const img = new Image();
      img.src = "image.jpg";

      img.addEventListener("load", () => {
        canvasRef.width = img.width;
        canvasRef.height = img.height;
        offscreen = canvasRef.transferControlToOffscreen();
        editorWorker.postMessage({ offscreen }, [offscreen]);
      });
    }
  });

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

  const setTextOptionsRef = (ref: HTMLElement) => {
    setTextSettingsRef(ref);
  };

  const context: EditorContextValue = {
    state: {
      editorType,
      textOptions,
      textOptionsRef: textSettingsRef,
    },
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
    onEditorTypeChange,

    setTextOptions,
    setTextOptionsRef,
  };

  const handleLoad = (bitmap: ImageBitmap) => {
    setIsLoaded(true);

    if (canvasRef) {
      canvasRef.width = bitmap.width;
      canvasRef.height = bitmap.height;
      offscreen = canvasRef.transferControlToOffscreen();
      postMessage({ canvas: offscreen, bitmap }, [offscreen]);
    }
  };

  const handleDownloadButtonClick = () => {
    if (canvasRef) {
      canvasRef.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "image.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        },
        "image/png",
        1,
      );
    }
  };

  return (
    <EditorContext.Provider value={context}>
      <div class={styles.editor}>
        <div ref={containerRef} class={styles.container}>
          <Show when={isLoaded()} fallback={<BrowseFile onLoad={handleLoad} />}>
            <canvas ref={canvasRef} class={styles.canvas} />
            <Switch>
              <Match when={editorType() === "text"}>
                <TextEditor />
              </Match>
            </Switch>
          </Show>
        </div>
        <Sidebar />
      </div>
      <DownloadButton onClick={handleDownloadButtonClick} />
    </EditorContext.Provider>
  );
}
