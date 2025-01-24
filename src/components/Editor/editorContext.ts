import { EditorType, TextElementOptions, TextOptions } from "@/types";
import { Accessor, createContext, useContext } from "solid-js";

type TextEditorState = {
  textOptions: Accessor<TextOptions>;
  textOptionsRef: Accessor<HTMLElement | undefined>;
  textElements: Accessor<TextElementOptions[]>;

  setTextOptions: (options: TextOptions) => void;
  setTextOptionsRef: (ref: HTMLElement) => void;
  setTextElements: (elements: TextElementOptions[]) => void;
};

type EnhanceEditorState = {
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onVignetteChange: (value: number) => void;
  onWarmthChange: (value: number) => void;
  onGrainChange: (value: number) => void;
  onHighlightsChange: (value: number) => void;
  onShadowsChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onFadeChange: (value: number) => void;
  onEnhanceChange: (value: number) => void;
};

export type EditorContextValue = {
  editorType: Accessor<EditorType>;
  onEditorTypeChange: (type: EditorType) => void;

  text: TextEditorState;
  enhance: EnhanceEditorState;
};

export const EditorContext = createContext<EditorContextValue>();

export const useEditorContext = (name: string) => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error(
      `[${name}]: useEditorContext should be called inside its ContextProvider`,
    );
  }

  return context;
};
