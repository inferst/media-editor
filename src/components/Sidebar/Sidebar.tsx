import "./Sidebar.css";
import Undo from "../../assets/icons/undo.svg";
import Redo from "../../assets/icons/redo.svg";
import { Tabs } from "../Tabs/Tabs";

export function Sidebar() {
  return (
    <div class="sidebar">
      <div class="sidebar__title">
        <div class="title">Edit</div>
        <div class="undo-redo">
          <div class="undo">
            <Undo />
          </div>
          <div class="redo">
            <Redo />
          </div>
        </div>
      </div>
      <div class="sidebar__tabs">
        <Tabs />
      </div>
      <div class='shadow'></div>
    </div>
  );
}
