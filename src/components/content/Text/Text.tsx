import { createSignal, For } from "solid-js";
import { TextAlignment, TextStyle } from "../../../types/text";
import { useEditorContext } from "../../Editor/editorContext";
import Adjust from "../../ui/Adjust/Adjust";
import Colors from "../../ui/Colors/Colors";
import Label from "../../ui/Label/Label";
import SidebarButton from "../../ui/SidebarButton/SidebarButton";
import SidebarRow from "../../ui/SidebarRow/SidebarRow";
import { Alignment } from "./Alignment/Alignment";
import { Style } from "./Style/Style";
import styles from "./Text.module.css";
import { getDefaultTextOptions } from "./textOptions";

type TextFont = {
  style: string;
  font: string;
};

const defaultOptions = getDefaultTextOptions();

const Text = () => {
  const [color, setColor] = createSignal(defaultOptions.color);
  const [alignment, setAlignment] = createSignal<TextAlignment>(
    defaultOptions.alignment,
  );
  const [style, setStyle] = createSignal<TextStyle>(defaultOptions.style);
  const [size, setSize] = createSignal(defaultOptions.size);
  const [font, setFont] = createSignal(defaultOptions.font);

  const context = useEditorContext("Text");

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

  const setTextOptions = () => {
    context.onTextOptionsChange({
      alignment: alignment(),
      font: font(),
      size: size(),
      color: color(),
      style: style(),
    });
  };

  const handleAlignmentClick = (item: TextAlignment) => {
    setAlignment(item);
    setTextOptions();
  };

  const handleStyleClick = (item: TextStyle) => {
    setStyle(item);
    setTextOptions();
  };

  const handleSizeChange = (value: number) => {
    setSize(value);
    setTextOptions();
  };

  const handleFontChange = (value: string) => {
    setFont(value);
    setTextOptions();
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    setTextOptions();
  };

  return (
    <>
      <Colors colors={colors} onChange={handleColorChange} />
      <div class={styles["text-row"]}>
        <SidebarRow isColumn={true}>
          <Alignment
            value={alignment()}
            onClick={(value) => handleAlignmentClick(value)}
          />
        </SidebarRow>
        <SidebarRow isColumn={true}>
          <Style value={style()} onClick={(value) => handleStyleClick(value)} />
        </SidebarRow>
      </div>
      <Adjust
        heading="Size"
        min={0}
        max={48}
        default={0}
        value={size()}
        onChange={handleSizeChange}
        color={color()}
      />
      <Label class={styles.label}>Font</Label>
      <SidebarRow>
        <For each={fonts}>
          {(item) => (
            <SidebarButton
              onClick={() => handleFontChange(item.font)}
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
