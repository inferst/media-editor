import styles from "./TextElement.module.css";

export const TextElement = () => {
  const handleMouseDown = (event: MouseEvent) => {
    event?.stopPropagation();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      contenteditable={true}
      class={styles.element}
    > </div>
  );
};
