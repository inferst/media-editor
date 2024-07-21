import clsx from "clsx";
import { JSX, ParentComponent, Show } from "solid-js";
import styles from "./SidebarButton.module.css";

export type SidebarButtonProps = {
  onClick?: () => void;
  icon?: JSX.Element;
  isActive?: boolean;
  class?: JSX.ElementClass;
};

const SidebarButton: ParentComponent<SidebarButtonProps> = (props) => {
  return (
    <div
      onClick={() => props.onClick?.()}
      class={clsx(styles.row, props.class, { [styles.active]: props.isActive })}
    >
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <Show when={props.children}>
        <div class={styles.title}>{props.children}</div>
      </Show>
    </div>
  );
};

export default SidebarButton;
