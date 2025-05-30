import { createSignal } from "solid-js";
import { useEditorContext } from "../../Editor/editorContext";
import Adjust from "../../ui/Adjust/Adjust";

const Enhance = () => {
  const [enhance, setEnhance] = createSignal(50);
  const [brightness, setBrightness] = createSignal(-50);
  const [contrast, setContrast] = createSignal(0);
  const [saturation, setSaturation] = createSignal(0);
  const [warmth, setWarmth] = createSignal(0);
  const [fade, setFade] = createSignal(0);
  const [highlights, setHighlights] = createSignal(0);
  const [shadows, setShadows] = createSignal(0);
  const [vignette, setVignette] = createSignal(0);
  const [grain, setGrain] = createSignal(0);
  const [sharpen, setSharpen] = createSignal(0);

  const state = useEditorContext("Enhance").enhance;

  const handleBrightnessChange = (value: number) => {
    state.onBrightnessChange(value + 100);
    setBrightness(value);
  };

  const handleContrastChange = (value: number) => {
    state.onContrastChange(value);
    setContrast(value);
  };

  const handleVignetteChange = (value: number) => {
    state.onVignetteChange(value);
    setVignette(value);
  };

  const handleWarmthChange = (value: number) => {
    state.onWarmthChange(value);
    setWarmth(value);
  };

  const handleSaturationChange = (value: number) => {
    state.onSaturationChange(value);
    setSaturation(value);
  };

  const handleFadeChange = (value: number) => {
    state.onFadeChange(value);
    setFade(value);
  };

  const handleHighlightsChange = (value: number) => {
    state.onHighlightsChange(value);
    setHighlights(value);
  };

  const handleShadowsChange = (value: number) => {
    state.onShadowsChange(value);
    setShadows(value);
  };

  const handleGrainChange = (value: number) => {
    state.onGrainChange(value);
    setGrain(value);
  };

  const handleEnhanceChange = (value: number) => {
    state.onEnhanceChange(value);
    setEnhance(value);
  };

  const color = "#4E8EE5";

  return (
    <>
      <Adjust
        onChange={handleEnhanceChange}
        value={enhance()}
        min={0}
        max={100}
        default={0}
        heading="Enhance"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleBrightnessChange}
        value={brightness()}
        min={-100}
        max={100}
        default={0}
        heading="Brightness"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleContrastChange}
        value={contrast()}
        min={-100}
        max={100}
        default={0}
        heading="Contrast"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleSaturationChange}
        value={saturation()}
        min={-100}
        max={100}
        default={0}
        heading="Saturation"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleWarmthChange}
        value={warmth()}
        min={-100}
        max={100}
        default={0}
        heading="Warmth"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleFadeChange}
        value={fade()}
        min={0}
        max={100}
        default={0}
        heading="Fade"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleHighlightsChange}
        value={highlights()}
        min={-100}
        max={100}
        default={0}
        heading="Highlights"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleShadowsChange}
        value={shadows()}
        min={-100}
        max={100}
        default={0}
        heading="Shadows"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleVignetteChange}
        value={vignette()}
        min={0}
        max={100}
        default={0}
        heading="Vignette"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={handleGrainChange}
        value={grain()}
        min={0}
        max={100}
        default={0}
        heading="Grain"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setSharpen}
        value={sharpen()}
        min={0}
        max={100}
        default={0}
        heading="Sharpen"
        color={color}
        variant="highlight"
      />
    </>
  );
};

export default Enhance;
