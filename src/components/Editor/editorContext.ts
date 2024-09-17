import { Accessor, createContext, useContext } from "solid-js";
import { EditorType } from "../../types/editor";
import { TextOptions } from "../../types/text";

export type EditorState = {
  editorType: Accessor<EditorType>;
  textOptions: Accessor<TextOptions>;
  textOptionsRef: Accessor<HTMLElement | undefined>;
};

export type EditorContextValue = {
  state: EditorState;

  setTextOptionsRef: (ref: HTMLElement) => void;

  onEditorTypeChange: (type: EditorType) => void;

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

  setTextOptions: (options: TextOptions) => void;
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
