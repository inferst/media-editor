import { Position, Size } from "./editor";

export type TextAlignment = "left" | "center" | "right";

export type TextStyle = "noframe" | "black" | "white";

export type TextOptions = {
  color: string;
  alignment: TextAlignment;
  style: TextStyle;
  size: number;
  font: string;
};

export type TextElementOptions = {
  id: string;
  position: Position;
  size: Size;
  options: TextOptions;
};
