import { HsvObject } from "@/utils";
import { Position, Size } from "./editor";

export type TextAlignment = "left" | "center" | "right";

export type TextStyle = "noframe" | "black" | "white";

export type TextOptions = {
  color: HsvObject;
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

export type TextFont = {
  title: string;
  font: string;
};
