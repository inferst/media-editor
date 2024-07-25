export type MessageEvent = {
  data: MessageData;
};

export type MessageData =
  | OffscreenData
  | VignetteData
  | ContrastData
  | WarmthData
  | GrainData
  | HighlightsData
  | ShadowsData
  | FadeData
  | SaturationData;

export const isOffscreenData = (data: MessageData): data is OffscreenData => {
  return "canvas" in data && "bitmap" in data;
};

export type OffscreenData = {
  canvas: OffscreenCanvas;
  bitmap: ImageBitmap;
};

export const isVignetteData = (data: MessageData): data is VignetteData => {
  return "vignette" in data;
};

export type VignetteData = {
  vignette: number;
};

export const isContrastData = (data: MessageData): data is ContrastData => {
  return "contrast" in data;
};

export type ContrastData = {
  contrast: number;
};

export const isWarmthData = (data: MessageData): data is WarmthData => {
  return "warmth" in data;
};

export type WarmthData = {
  warmth: number;
};

export const isGrainData = (data: MessageData): data is GrainData => {
  return "grain" in data;
};

export type GrainData = {
  grain: number;
};

export const isHighlightsData = (data: MessageData): data is HighlightsData => {
  return "highlights" in data;
};

export type HighlightsData = {
  highlights: number;
};

export const isShadowsData = (data: MessageData): data is ShadowsData => {
  return "shadows" in data;
};

export type ShadowsData = {
  shadows: number;
};

export const isFadeData = (data: MessageData): data is FadeData => {
  return "fade" in data;
};

export type FadeData = {
  fade: number;
};

export const isSaturationData = (data: MessageData): data is SaturationData => {
  return "saturation" in data;
};

export type SaturationData = {
  saturation: number;
};
