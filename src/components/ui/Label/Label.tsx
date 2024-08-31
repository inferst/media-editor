import clsx from "clsx";
import { JSX, ParentComponent, Show } from "solid-js";
import styles from "./Label.module.css";

type LabelProps = {
  tail?: JSX.Element;
  class?: JSX.ElementClass;
};

const Label: ParentComponent<LabelProps> = (props) => {
  return (
    <div class={clsx(styles.label, props.class)}>
      <div class={styles.heading}>{props.children}</div>
      <Show when={props.tail}>
        <div class={styles.tail}>{props.tail}</div>
      </Show>
    </div>
  );
};

export default Label;
