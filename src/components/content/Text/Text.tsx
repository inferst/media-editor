import { TextAlignment, TextOptions, TextStyle } from "@/types";
import { fonts, HsvObject, hsvToHex } from "@/utils";
import { createSignal, For, onMount } from "solid-js";
import { useEditorContext } from "../../Editor/editorContext";
import Adjust from "../../ui/Adjust/Adjust";
import Colors from "../../ui/Colors/Colors";
import Label from "../../ui/Label/Label";
import SidebarButton from "../../ui/SidebarButton/SidebarButton";
import SidebarRow from "../../ui/SidebarRow/SidebarRow";
import { Alignment } from "./Alignment/Alignment";
import { Style } from "./Style/Style";
import styles from "./Text.module.css";

const Text = () => {
  const [ref, setRef] = createSignal<HTMLElement | undefined>();

  const state = useEditorContext("Text").text;

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

  const setTextOptions = (options: TextOptions) => {
    state.setTextOptions(options);
  };

  const handleAlignmentClick = (item: TextAlignment) => {
    setTextOptions({
      ...state.textOptions(),
      alignment: item,
    });
  };

  const handleStyleClick = (item: TextStyle) => {
    setTextOptions({
      ...state.textOptions(),
      style: item,
    });
  };

  const handleSizeChange = (value: number) => {
    setTextOptions({
      ...state.textOptions(),
      size: value,
    });
  };

  const handleFontChange = (value: string) => {
    setTextOptions({
      ...state.textOptions(),
      font: value,
    });
  };

  const handleColorChange = (value: HsvObject) => {
    setTextOptions({
      ...state.textOptions(),
      color: value,
    });
  };

  onMount(() => {
    const element = ref();
    if (element) {
      state.setTextOptionsRef(element);
    }
  });

  return (
    <div ref={setRef}>
      <Colors
        color={state.textOptions().color}
        colors={colors}
        onChange={handleColorChange}
      />
      <div class={styles["text-row"]}>
        <SidebarRow isColumn={true}>
          <Alignment
            value={state.textOptions().alignment}
            onClick={(value) => handleAlignmentClick(value)}
          />
        </SidebarRow>
        <SidebarRow isColumn={true}>
          <Style
            value={state.textOptions().style}
            onClick={(value) => handleStyleClick(value)}
          />
        </SidebarRow>
      </div>
      <Adjust
        heading="Size"
        min={8}
        max={48}
        default={8}
        value={state.textOptions().size}
        onChange={handleSizeChange}
        color={hsvToHex(state.textOptions().color)}
      />
      <Label class={styles.label}>Font</Label>
      <SidebarRow>
        <For each={fonts}>
          {(item) => (
            <SidebarButton
              onClick={() => handleFontChange(item.font)}
              isActive={state.textOptions().font == item.font}
              style={{ "font-family": item.font }}
            >
              {item.title}
            </SidebarButton>
          )}
        </For>
      </SidebarRow>
    </div>
  );
};

export default Text;
