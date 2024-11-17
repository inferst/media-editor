import { TextOptions } from "@/types";
import { hexToHsv } from "@/utils";

export const getDefaultTextOptions: () => TextOptions = () => ({
  font: "Roboto",
  alignment: "left",
  style: "noframe",
  color: hexToHsv("#ffffff"),
  size: 24,
});
