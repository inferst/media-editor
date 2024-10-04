export type EditorType = "enhance" | "crop" | "text" | "brush" | "smile";

export type Position = {
  left: number;
  top: number;
}

export type Size = {
  width: number;
  height: number;
}

export type Rect = Position & Size;
