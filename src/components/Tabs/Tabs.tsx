import BrushSVG from "@assets/icons/brush.svg";
import CropSVG from "@assets/icons/crop.svg";
import EnhanceSVG from "@assets/icons/enhance.svg";
import SmileSVG from "@assets/icons/smile.svg";
import TextSVG from "@assets/icons/text.svg";
import clsx from "clsx";
import { createMemo, createSignal, For, JSX, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import Crop from "../content/Crop/Crop";
import Enhance from "../content/Enhance/Enhance";
import Text from "../content/Text/Text";
import Tab, { TabItemType } from "./Tab";
import styles from "./Tabs.module.css";
import Brush from "../content/Brush/Brush";
import Smile from "../content/Smile/Smile";

export type TabItem = {
  type: TabItemType;
  tab: JSX.Element;
  content: ValidComponent;
};

export type TabsProps = {
  onClick: (item: TabItem) => void;
};

export function Tabs() {
  const [currentTabType, setCurrentTabType] =
    createSignal<TabItemType>("enhance");

  const tabs: TabItem[] = [
    {
      type: "enhance",
      tab: <EnhanceSVG />,
      content: Enhance,
    },
    {
      type: "crop",
      tab: <CropSVG />,
      content: Crop,
    },
    {
      type: "text",
      tab: <TextSVG />,
      content: Text,
    },
    {
      type: "brush",
      tab: <BrushSVG />,
      content: Brush,
    },
    {
      type: "smile",
      tab: <SmileSVG />,
      content: Smile,
    },
  ];

  const currentTab = createMemo(() => {
    return tabs.find((tab) => tab.type == currentTabType());
  });

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
    setCurrentTabType(type);
  };

  return (
    <>
      <div class={styles.tabs}>
        <For each={tabs}>
          {(item) => (
            <Tab
              type={item.type}
              onClick={handleClick}
              isActive={item.type == currentTabType()}
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
        <div class={clsx(styles.content, styles.active)}>
          <Dynamic component={currentTab()?.content} />
        </div>
      </div>
    </>
  );
}
