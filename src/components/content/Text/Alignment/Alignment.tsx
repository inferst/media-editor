import CenterSVG from "@/assets/icons/align_centre.svg";
import LeftSVG from "@/assets/icons/align_left.svg";
import RightSVG from "@/assets/icons/align_right.svg";
import { TextAlignment } from "@/types";
import { Component, For, JSX } from "solid-js";
import SidebarButton from "../../../ui/SidebarButton/SidebarButton";

type Alignment = {
  alignment: TextAlignment;
  icon: JSX.Element;
};

export type AlignmentProps = {
  value: TextAlignment;
  onClick: (value: TextAlignment) => void;
};

export const Alignment: Component<AlignmentProps> = (props) => {
  const alignments: Alignment[] = [
    {
      alignment: "left",
      icon: <LeftSVG />,
    },
    {
      alignment: "center",
      icon: <CenterSVG />,
    },
    {
      alignment: "right",
      icon: <RightSVG />,
    },
  ];

  return (
    <For each={alignments}>
      {(item) => (
        <SidebarButton
          icon={item.icon}
          isActive={item.alignment == props.value}
          onClick={() => props.onClick(item.alignment)}
        />
      )}
    </For>
  );
};
