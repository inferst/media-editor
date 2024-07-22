import { onMount } from "solid-js";
import styles from "./Editor.module.css";

export function Editor() {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (canvasRef) {
      const context = canvasRef.getContext("2d");
      const img = new Image();
      img.src = "image.jpg";

      canvasRef.width = img.width;
      canvasRef.height = img.height;

      img.addEventListener("load", () => {
        context?.drawImage(img, 0, 0);
      });
    }
  });

  return (
    <div class={styles.editor}>
      <canvas ref={canvasRef} />
    </div>
  );
}
