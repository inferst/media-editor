import clsx from "clsx";
import { JSX, ParentComponent } from "solid-js";
import { EditorType } from "../../types/editor";
import styles from "./Tabs.module.css";

export type TabItemType = EditorType;

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
      class={clsx(styles.tab, { [styles.active]: props.isActive })}
    >
      {props.children}
    </div>
  );
};

export default Tab;
