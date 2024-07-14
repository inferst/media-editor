import BrushSVG from "@assets/icons/brush.svg";
import CropSVG from "@assets/icons/crop.svg";
import EnhanceSVG from "@assets/icons/enhance.svg";
import SmileSVG from "@assets/icons/smile.svg";
import TextSVG from "@assets/icons/text.svg";
import clsx from "clsx";
import { createSignal, For, JSX } from "solid-js";
import Enhance from "../content/Enhance/Enhance";
import Tab, { TabItemType } from "./Tab";
import styles from "./Tabs.module.css";

export type TabItem = {
  type: TabItemType;
  tab: JSX.Element;
  content: JSX.Element;
};

export type TabsProps = {
  onClick: (item: TabItem) => void;
};

export function Tabs() {
  const [currentTab, setCurrentTab] = createSignal<TabItemType>("enhance");

  const tabs: TabItem[] = [
    {
      type: "enhance",
      tab: <EnhanceSVG />,
      content: <Enhance />,
    },
    {
      type: "crop",
      tab: <CropSVG />,
      content: "",
    },
    {
      type: "text",
      tab: <TextSVG />,
      content: "",
    },
    {
      type: "brush",
      tab: <BrushSVG />,
      content: "",
    },
    {
      type: "smile",
      tab: <SmileSVG />,
      content: "",
    },
  ];

  // const index = createMemo(() => {
  //   const tab = tabs.find((tab) => tab.type == currentTab());
  //
  //   if (tab) {
  //     return tabs.indexOf(tab);
  //   }
  //
  //   return 0;
  // });

  const handleClick = (type: TabItemType) => {
    setCurrentTab(type);
  };

  return (
    <>
      <div class={styles.tabs}>
        <For each={tabs}>
          {(item) => (
            <Tab
              type={item.type}
              onClick={handleClick}
              isActive={item.type == currentTab()}
            >
              {item.tab}
            </Tab>
          )}
        </For>
        <div class={styles.selected}>
          <div class={clsx(styles.line, styles.active)} />
        </div>
      </div>
      <div class={styles.scrollable}>
        <For each={tabs}>
          {(tab) => (
            <div
              class={clsx(styles.content, {
                [styles["content--active"]]: tab.type == currentTab(),
              })}
            >
              {tab.content}
            </div>
          )}
        </For>
      </div>
    </>
  );
}
