/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSignal, onMount, Show } from "solid-js";
import EditorWorker from "../../workers/editorWorker?worker";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./Editor.module.css";
import { EditorContext, EditorContextValue } from "./editorContext";
import { MessageData } from "../../types/types";
import BrowseFile from "./BrowseFile";

const editorWorker = new EditorWorker();

const postMessage = (data: MessageData, transfer?: Transferable[]) => {
  editorWorker.postMessage(data, transfer ?? []);
};

export function Editor() {
  const [isLoaded, setIsLoaded] = createSignal(false);

  let canvasRef: HTMLCanvasElement | undefined;
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
    // editorWorker.postMessage({
    //   event: "brightness",
    //   value: value,
    // });
  };

  const onContrastChange = (value: number) => {
    postMessage({
      contrast: (value + 100) / 100,
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
      grain: value / 100,
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

  const context: EditorContextValue = {
    state: {
      onBrightnessChange,
      onContrastChange,
      onVignetteChange,
      onShadowsChange,
      onFadeChange,
      onGrainChange,
      onWarmthChange,
      onHighlightsChange,
      onSaturationChange
    },
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

  return (
    <EditorContext.Provider value={context}>
      <div class={styles.editor}>
        <div class={styles.wrapper}>
          <Show when={isLoaded()} fallback={<BrowseFile onLoad={handleLoad} />}>
            <canvas ref={canvasRef} />
          </Show>
        </div>
        <Sidebar />
      </div>
    </EditorContext.Provider>
  );
}
