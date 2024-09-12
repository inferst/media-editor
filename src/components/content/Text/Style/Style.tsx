import BlackSVG from "@assets/icons/black.svg";
import NoFrameSVG from "@assets/icons/no_frame.svg";
import WhiteSVG from "@assets/icons/white.svg";
import { Component, For, JSX } from "solid-js";
import { TextStyle } from "../../../../types/text";
import SidebarButton from "../../../ui/SidebarButton/SidebarButton";

type Style = {
  style: TextStyle;
  icon: JSX.Element;
};

const styles: Style[] = [
  {
    style: "noframe",
    icon: <NoFrameSVG />,
  },
  {
    style: "black",
    icon: <BlackSVG />,
  },
  {
    style: "white",
    icon: <WhiteSVG />,
  },
];

export type StyleProps = {
  value: TextStyle;
  onClick: (value: TextStyle) => void;
};

export const Style: Component<StyleProps> = (props) => {
  return (
    <For each={styles}>
      {(item) => (
        <SidebarButton
          icon={item.icon}
          isActive={item.style == props.value}
          onClick={() => props.onClick(item.style)}
        />
      )}
    </For>
  );
};
