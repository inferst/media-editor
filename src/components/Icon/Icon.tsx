import "./Sidebar.css";
import undo from '/icons/undo.svg?raw';

console.log(undo)

export function Icon() {
  return (
    <div class="sidebar">
      <div class="sidebar__title">Edit</div>
      <div class="undo-redo">
        <div class="undo" innerHTML={undo}></div>
        <div class="redo"></div>
      </div>
    </div>
  );
}
