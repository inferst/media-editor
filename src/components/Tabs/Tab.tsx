import { JSX, ParentComponent } from "solid-js";
import clsx from "clsx";
import styles from "./Tabs.module.css";

export type TabItemType = "enhance" | "crop" | "text" | "brush" | "smile";

export type TabProps = {
  type: TabItemType;
  isActive?: boolean;
  onClick: (item: TabItemType) => void;
};

const Tab: ParentComponent<TabProps> = (props): JSX.Element => {
  const handleClick = () => {
    props.onClick(props.type);
  };

  return (
    <div
      onClick={handleClick}
      class={clsx(styles.tab, { [styles["tab--active"]]: props.isActive })}
    >
      {props.children}
    </div>
  );
};

export default Tab;
