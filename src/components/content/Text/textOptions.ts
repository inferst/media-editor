import { TextOptions } from "../../../types/text";

export const getDefaultTextOptions: () => TextOptions = () => ({
  font: "Roboto",
  alignment: "left",
  style: "noframe",
  color: "#ffffff",
  size: 24,
});
