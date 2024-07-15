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

  return (
    <>
      <Adjust
        onChange={setEnhance}
        value={enhance()}
        min={0}
        max={100}
        default={0}
        variant="active"
        heading="Enhance"
      />
      <Adjust
        onChange={setBrightness}
        value={brightness()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Brightness"
      />
      <Adjust
        onChange={setContrast}
        value={contrast()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Contrast"
      />
      <Adjust
        onChange={setSaturation}
        value={saturation()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Saturation"
      />
      <Adjust
        onChange={setWarmth}
        value={warmth()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Warmth"
      />
      <Adjust
        onChange={setFade}
        value={fade()}
        min={0}
        max={100}
        default={0}
        variant="active"
        heading="Fade"
      />
      <Adjust
        onChange={setHighlights}
        value={highlights()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Highlights"
      />
      <Adjust
        onChange={setShadows}
        value={shadows()}
        min={-100}
        max={100}
        default={0}
        variant="active"
        heading="Shadows"
      />
      <Adjust
        onChange={setVignette}
        value={vignette()}
        min={0}
        max={100}
        default={0}
        variant="active"
        heading="Vignette"
      />
      <Adjust
        onChange={setGrain}
        value={grain()}
        min={0}
        max={100}
        default={0}
        variant="active"
        heading="Grain"
      />
      <Adjust
        onChange={setSharpen}
        value={sharpen()}
        min={0}
        max={100}
        default={0}
        variant="active"
        heading="Sharpen"
      />
    </>
  );
};

export default Enhance;
