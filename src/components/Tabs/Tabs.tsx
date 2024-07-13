import Enhance from "../../assets/icons/enhance.svg";
import Crop from "../../assets/icons/crop.svg";
import Text from "../../assets/icons/text.svg";
import Brush from "../../assets/icons/brush.svg";
import Smile from "../../assets/icons/smile.svg";
import './Tabs.css';

export function Tabs() {
  return (
    <div class="tabs">
      <div class="tab tab--active">
        <Enhance />
      </div>
      <div class="tab">
        <Crop />
      </div>
      <div class="tab">
        <Text />
      </div>
      <div class="tab">
        <Brush />
      </div>
      <div class="tab">
        <Smile />
      </div>
    </div>
  );
}
