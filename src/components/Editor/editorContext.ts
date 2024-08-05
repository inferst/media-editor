import { createContext, useContext } from "solid-js";

export type EditorState = {
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
  state: EditorState;
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
