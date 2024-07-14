import Brush from "@assets/icons/brush.svg";
import Crop from "@assets/icons/crop.svg";
import Enhance from "@assets/icons/enhance.svg";
import Smile from "@assets/icons/smile.svg";
import Text from '@assets/icons/text.svg';
import { createSignal, For, JSX } from "solid-js";
import Tab, { TabItemType } from "./Tab";
import "./Tabs.css";

export type TabItem = {
  type: TabItemType;
  element: JSX.Element;
};

export type TabsProps = {
  onClick: (item: TabItem) => void;
};

export function Tabs() {
  const [currentTab, setCurrentTab] = createSignal<TabItemType>('enhance');

  const icons: TabItem[] = [
    {
      type: "enhance",
      element: <Enhance />,
    },
    {
      type: "crop",
      element: <Crop />,
    },
    {
      type: "text",
      element: <Text />,
    },
    {
      type: "brush",
      element: <Brush />,
    },
    {
      type: "smile",
      element: <Smile />,
    },
  ];

  const handleClick = (type: TabItemType) => {
    setCurrentTab(type);
    console.log(type);
  };

  return (
    <div class="tabs">
      <For each={icons}>
        {(icon) => (
          <Tab type={icon.type} onClick={handleClick} isActive={icon.type == currentTab()}>
            {icon.element}
          </Tab>
        )}
      </For>
    </div>
  );
}
