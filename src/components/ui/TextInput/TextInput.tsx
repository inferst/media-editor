import { Component } from "solid-js";
import { JSX } from "solid-js/h/jsx-runtime";
import styles from "./TextInput.module.css";

export type TextInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

const TextInput: Component<TextInputProps> = (props) => {
  const handleChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (
    event,
  ) => {
    props.onChange(event.currentTarget.value);
  };

  return (
    <div class={styles.input}>
      <input type="text" value={props.value} onInput={handleChange} />
      <span class={styles.placeholder}>{props.placeholder}</span>
    </div>
  );
};

export default TextInput;
