import CenterSVG from "@assets/icons/align_centre.svg";
import LeftSVG from "@assets/icons/align_left.svg";
import RightSVG from "@assets/icons/align_right.svg";
import { Component, For, JSX } from "solid-js";
import { TextAlignment } from "../../../../types/text";
import SidebarButton from "../../../ui/SidebarButton/SidebarButton";

type Alignment = {
  alignment: TextAlignment;
  icon: JSX.Element;
};

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

export type AlignmentProps = {
  value: TextAlignment;
  onClick: (value: TextAlignment) => void;
};

export const Alignment: Component<AlignmentProps> = (props) => {
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
