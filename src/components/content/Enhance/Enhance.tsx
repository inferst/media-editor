import { createSignal } from "solid-js";
import Adjust from "../../ui/Adjust/Adjust";
import { useEditorContext } from "../../Editor/editorContext";

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

  const context = useEditorContext("Enhance");

  const handleBrightnessChange = (value: number) => {
    context.state.onBrightnessChange(value + 100);
    setBrightness(value);
  };

  const handleContrastChange = (value: number) => {
    context.state.onContrastChange(value);
    setContrast(value);
  };

  const handleVignetteChange = (value: number) => {
    context.state.onVignetteChange(value);
    setVignette(value);
  };

  const handleWarmthChange = (value: number) => {
    context.state.onWarmthChange(value);
    setWarmth(value);
  };

  const handleSaturationChange = (value: number) => {
    context.state.onSaturationChange(value);
    setSaturation(value);
  };

  const handleFadeChange = (value: number) => {
    context.state.onFadeChange(value);
    setFade(value);
  };

  const handleHighlightsChange = (value: number) => {
    context.state.onHighlightsChange(value);
    setHighlights(value);
  };

  const handleShadowsChange = (value: number) => {
    context.state.onShadowsChange(value);
    setShadows(value);
  };

  const color = "#4E8EE5";

  return (
    <>
      <Adjust
        onChange={setEnhance}
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
        onChange={setGrain}
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
