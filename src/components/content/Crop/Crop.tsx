import Ratio16x9SVG from "@assets/icons/16x9.svg";
import Ratio2x3SVG from "@assets/icons/2x3.svg";
import Ratio3x2SVG from "@assets/icons/3x2.svg";
import Ratio3x4SVG from "@assets/icons/3x4.svg";
import Ratio4x3SVG from "@assets/icons/4x3.svg";
import Ratio4x5SVG from "@assets/icons/4x5.svg";
import Ratio5x4SVG from "@assets/icons/5x4.svg";
import Ratio5x7SVG from "@assets/icons/5x7.svg";
import Ratio7x5SVG from "@assets/icons/7x5.svg";
import Ratio9x16SVG from "@assets/icons/9x16.svg";
import FreeSVG from "@assets/icons/free.svg";
import OriginalSVG from "@assets/icons/imageoriginal.svg";
import SquareSVG from "@assets/icons/square.svg";
import Label from "../../ui/Label/Label";
import SidebarButton from "../../ui/SidebarButton/SidebarButton";
import SidebarRow from "../../ui/SidebarRow/SidebarRow";
import styles from "./Crop.module.css";

const Crop = () => {
  return (
    <>
      <Label class={styles.label}>Aspect ratio</Label>
      <SidebarRow>
        <SidebarButton icon={<FreeSVG />}>Free</SidebarButton>
      </SidebarRow>
      <SidebarRow>
        <SidebarButton icon={<OriginalSVG />}>Original</SidebarButton>
      </SidebarRow>
      <SidebarRow>
        <SidebarButton icon={<SquareSVG />}>Square</SidebarButton>
      </SidebarRow>
      <SidebarRow isColumn={true}>
        <SidebarButton icon={<Ratio3x2SVG />}>3:2</SidebarButton>
        <SidebarButton icon={<Ratio2x3SVG />}>2:3</SidebarButton>
      </SidebarRow>
      <SidebarRow isColumn={true}>
        <SidebarButton icon={<Ratio4x3SVG />}>4:3</SidebarButton>
        <SidebarButton icon={<Ratio3x4SVG />}>3:4</SidebarButton>
      </SidebarRow>
      <SidebarRow isColumn={true}>
        <SidebarButton icon={<Ratio5x4SVG />}>5:4</SidebarButton>
        <SidebarButton icon={<Ratio4x5SVG />}>4:5</SidebarButton>
      </SidebarRow>
      <SidebarRow isColumn={true}>
        <SidebarButton icon={<Ratio7x5SVG />}>7:5</SidebarButton>
        <SidebarButton icon={<Ratio5x7SVG />}>5:7</SidebarButton>
      </SidebarRow>
      <SidebarRow isColumn={true}>
        <SidebarButton icon={<Ratio16x9SVG />}>16:9</SidebarButton>
        <SidebarButton icon={<Ratio9x16SVG />}>9:16</SidebarButton>
      </SidebarRow>
    </>
  );
};

export default Crop;
