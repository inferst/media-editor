import { createSignal } from "solid-js";
import Adjust from "../../Adjust/Adjust";

const Enhance = () => {
  const [enhance, setEnhance] = createSignal(50);
  const [brightness, setBrightness] = createSignal(-50);
  const [contrast, setContrast] = createSignal(50);
  const [saturation, setSaturation] = createSignal(0);
  const [warmth, setWarmth] = createSignal(0);
  const [fade, setFade] = createSignal(0);
  const [highlights, setHighlights] = createSignal(0);
  const [shadows, setShadows] = createSignal(0);
  const [vignette, setVignette] = createSignal(0);
  const [grain, setGrain] = createSignal(0);
  const [sharpen, setSharpen] = createSignal(0);

  const color = '#4E8EE5';

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
        onChange={setBrightness}
        value={brightness()}
        min={-100}
        max={100}
        default={0}
        heading="Brightness"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setContrast}
        value={contrast()}
        min={-100}
        max={100}
        default={0}
        heading="Contrast"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setSaturation}
        value={saturation()}
        min={-100}
        max={100}
        default={0}
        heading="Saturation"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setWarmth}
        value={warmth()}
        min={-100}
        max={100}
        default={0}
        heading="Warmth"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setFade}
        value={fade()}
        min={0}
        max={100}
        default={0}
        heading="Fade"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setHighlights}
        value={highlights()}
        min={-100}
        max={100}
        default={0}
        heading="Highlights"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setShadows}
        value={shadows()}
        min={-100}
        max={100}
        default={0}
        heading="Shadows"
        color={color}
        variant="highlight"
      />
      <Adjust
        onChange={setVignette}
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
