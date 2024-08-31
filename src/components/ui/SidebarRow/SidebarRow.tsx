import clsx from "clsx";
import { ParentComponent } from "solid-js";
import styles from "./SidebarRow.module.css";

export type SidebarRowProps = {
  isColumn?: boolean;
};

const SidebarRow: ParentComponent<SidebarRowProps> = (props) => {
  return (
    <div
      class={clsx(styles.row, {
        [styles.column]: props.isColumn,
      })}
    >
      {props.children}
    </div>
  );
};

export default SidebarRow;
