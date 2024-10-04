import ArrowSVG from "@/assets/tools/Arrow.svg";
import BrushSVG from "@/assets/tools/Brush.svg";
import NeonSVG from "@/assets/tools/Neon.svg";
import PenSVG from "@/assets/tools/Pen.svg";
import { createSignal } from "solid-js";
import Adjust from "../../ui/Adjust/Adjust";
import Colors from "../../ui/Colors/Colors";
import Label from "../../ui/Label/Label";
import ToolButton from "../../ui/ToolButton/ToolButton";
import styles from "./Brush.module.css";

type Tool = "pen" | "arrow" | "brush" | "neon" | "blur" | "eraser";

const Brush = () => {
  const [color, setColor] = createSignal("#FFFFFF");
  const [size, setSize] = createSignal(24);
  const [tool, setTool] = createSignal<Tool>("pen");

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
      <Adjust
        heading="Size"
        min={0}
        max={48}
        default={0}
        value={size()}
        onChange={setSize}
        color={color()}
      />
      <Label class={styles.label}>Tool</Label>
      <ToolButton
        onClick={() => setTool("pen")}
        icon={<PenSVG style={{ fill: color() }} />}
        isActive={tool() == "pen"}
      >
        Pen
      </ToolButton>
      <ToolButton
        onClick={() => setTool("arrow")}
        icon={<ArrowSVG style={{ fill: color() }} />}
        isActive={tool() == "arrow"}
      >
        Arrow
      </ToolButton>
      <ToolButton
        onClick={() => setTool("brush")}
        icon={<BrushSVG style={{ fill: color() }} />}
        isActive={tool() == "brush"}
      >
        Brush
      </ToolButton>
      <ToolButton
        onClick={() => setTool("neon")}
        icon={<NeonSVG style={{ fill: color() }} />}
        isActive={tool() == "neon"}
      >
        Neon
      </ToolButton>
      <ToolButton
        onClick={() => setTool("blur")}
        icon={<img src="/tools/Blur.png" />}
        isActive={tool() == "blur"}
      >
        Blur
      </ToolButton>
      <ToolButton
        onClick={() => setTool("eraser")}
        icon={<img src="/tools/Eraser.png" />}
        isActive={tool() == "eraser"}
      >
        Eraser
      </ToolButton>
    </>
  );
};

export default Brush;
