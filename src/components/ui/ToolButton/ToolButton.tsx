import clsx from "clsx";
import { JSX, ParentComponent, Show } from "solid-js";
import styles from "./ToolButton.module.css";

export type ToolButtonProps = {
  onClick?: () => void;
  icon?: JSX.Element;
  isActive?: boolean;
  class?: JSX.ElementClass;
};

const ToolButton: ParentComponent<ToolButtonProps> = (props) => {
  return (
    <div
      onClick={() => props.onClick?.()}
      class={clsx(styles.row, props.class, { [styles.active]: props.isActive })}
    >
      <Show when={props.icon}>
        <div class={styles.icon}>
          {props.icon}
          <div class={styles.shadow} />
        </div>
      </Show>
      <Show when={props.children}>
        <div class={styles.title}>{props.children}</div>
      </Show>
    </div>
  );
};

export default ToolButton;
