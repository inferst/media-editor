import { JSX, ParentComponent, Show } from "solid-js";
import styles from "./Label.module.css";

type LabelProps = {
  color?: string;
  tail?: JSX.Element;
};

const Label: ParentComponent<LabelProps> = (props) => {
  return (
    <div class={styles.label} style={{ color: props.color }}>
      <div class={styles.heading}>{props.children}</div>
      <Show when={props.tail}>
        <div class={styles.tail}>{props.tail}</div>
      </Show>
    </div>
  );
};

export default Label;
