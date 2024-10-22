import { Component } from "solid-js";
import styles from "./DownloadButton.module.css";
import CheckSVG from "@/assets/Check.svg";

export type DownloadButtonProps = {
  onClick: () => void;
};

export const DownloadButton: Component<DownloadButtonProps> = (props) => {
  return (
    <div onClick={() => props.onClick()} class={styles.button}>
      <CheckSVG />
    </div>
  );
};
