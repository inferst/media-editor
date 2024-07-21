import CenterSVG from "@assets/icons/align_centre.svg";
import LeftSVG from "@assets/icons/align_left.svg";
import RightSVG from "@assets/icons/align_right.svg";
import BlackSVG from "@assets/icons/black.svg";
import NoFrameSVG from "@assets/icons/no_frame.svg";
import WhiteSVG from "@assets/icons/white.svg";
import { createSignal, For } from "solid-js";
import Adjust from "../../ui/Adjust/Adjust";
import Colors from "../../ui/Colors/Colors";
import Label from "../../ui/Label/Label";
import SidebarButton from "../../ui/SidebarButton/SidebarButton";
import SidebarRow from "../../ui/SidebarRow/SidebarRow";
import styles from "./Text.module.css";

type TextFont = {
  style: string;
  font: string;
};

const Text = () => {
  const [color, setColor] = createSignal("#FFFFFF");
  const [size, setSize] = createSignal(24);
  const [font, setFont] = createSignal("Roboto");

  const fonts: TextFont[] = [
    {
      style: styles.roboto,
      font: "Roboto",
    },
    {
      style: styles.typewriter,
      font: "Typewriter",
    },
    {
      style: styles.avenir,
      font: "Avenir Next",
    },
    {
      style: styles.courier,
      font: "Courier New",
    },
    {
      style: styles.noteworthy,
      font: "Noteworthy",
    },
    {
      style: styles.georgia,
      font: "Georgia",
    },
    {
      style: styles.papyrus,
      font: "Papyrus",
    },
    {
      style: styles.snell,
      font: "Snell Roundhand",
    },
  ];

  const colors = [
    "#FFFFFF",
    "#FE4438",
    "#FF8901",
    "#FFD60A",
    "#33C759",
    "#62E5E0",
    "#0A84FF",
    "#BD5CF3",
  ];

  return (
    <>
      <Colors colors={colors} onChange={setColor} />
      <div class={styles["text-row"]}>
        <SidebarRow isColumn={true}>
          <SidebarButton icon={<LeftSVG />} isActive={true} />
          <SidebarButton icon={<CenterSVG />} />
          <SidebarButton icon={<RightSVG />} />
        </SidebarRow>
        <SidebarRow isColumn={true}>
          <SidebarButton icon={<NoFrameSVG />} isActive={true} />
          <SidebarButton icon={<BlackSVG />} />
          <SidebarButton icon={<WhiteSVG />} />
        </SidebarRow>
      </div>
      <Adjust
        heading="Size"
        min={0}
        max={48}
        default={0}
        value={size()}
        onChange={setSize}
        color={color()}
      />
      <Label class={styles.label}>Font</Label>
      <SidebarRow>
        <For each={fonts}>
          {(item) => (
            <SidebarButton
              onClick={() => setFont(item.font)}
              isActive={font() == item.font}
              class={item.style}
            >
              {item.font}
            </SidebarButton>
          )}
        </For>
      </SidebarRow>
    </>
  );
};

export default Text;
