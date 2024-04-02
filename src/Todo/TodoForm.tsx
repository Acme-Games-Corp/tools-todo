import { useState } from "react";
import "./TodoForm.css";

export interface TodoFormProps {
  onSubmit: (result: string) => string,
  initialValue?: string,
  placeholder?: string,
}

const TodoForm = ({ onSubmit, placeholder, initialValue = '' }: TodoFormProps) => {
  const [value, updateValue] = useState(initialValue);
  return (
    <form onSubmit={(evt) => {
      evt.preventDefault();
      const submitValue = onSubmit(value);
      updateValue(submitValue || '');
    }}>
      <input type="text" className={`TodoForm`} placeholder={placeholder} data-test="new-todo" onChange={e => updateValue(e.target.value)} value={value} />
    </form>
  );
}

export {
  TodoForm
}