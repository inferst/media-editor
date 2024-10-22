import BlackSVG from "@/assets/icons/black.svg";
import NoFrameSVG from "@/assets/icons/no_frame.svg";
import WhiteSVG from "@/assets/icons/white.svg";
import { TextStyle } from "@/types";
import { Component, For, JSX } from "solid-js";
import SidebarButton from "../../../ui/SidebarButton/SidebarButton";

type Style = {
  style: TextStyle;
  icon: JSX.Element;
};

export type StyleProps = {
  value: TextStyle;
  onClick: (value: TextStyle) => void;
};

export const Style: Component<StyleProps> = (props) => {
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
