import Redo from "@assets/icons/redo.svg";
import Undo from "@assets/icons/undo.svg";
import { Tabs } from "../Tabs/Tabs";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <div class={styles.sidebar}>
      <div class={styles.heading}>
        <div class={styles.title}>Edit</div>
        <div class={styles["undo-redo"]}>
          <div class={styles.undo}>
            <Undo />
          </div>
          <div class={styles.redo}>
            <Redo />
          </div>
        </div>
      </div>
      <Tabs />
    </div>
  );
}
