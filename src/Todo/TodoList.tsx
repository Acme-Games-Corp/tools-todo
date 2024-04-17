import { memo, useState, Dispatch } from "react";
import { Task, State, Action } from "./useTodoState";
import { TodoForm } from "./TodoForm";
import "./TodoList.css";

export interface TodoListProps extends State {
  dispatch: Dispatch<Action>
}

export interface TodoListItemProps {
  item: Task,
  index: number,
  onEdit: () => void,
  onSubmit: (value: string) => string,
  onComplete: () => void,
  edit: boolean,
}

export interface TodoListTreatmentProps {
  tasks: Task[],
}

const TodoListItem = ({ item, index, edit, onEdit, onSubmit, onComplete }: TodoListItemProps) => {
  return (
    <li className={item.completed ? 'completed' : 'active'}>
      <p>
        <input
          type="checkbox"
          onChange={() => onComplete()}
          checked={item.completed}
          id={`Todo_${index}`}
        />
        {edit && (<TodoForm onSubmit={onSubmit} initialValue={item.value} />)}
        {!edit && (
          <>
            <label htmlFor={`Todo_${index}`}>{ item.value }</label>
            <span className="editTask">
              &nbsp;
              <button onClick={() => onEdit()}>🖉</button>
            </span>
          </>
        )}
      </p>
    </li>
  );
};

const TodoList = memo(({ todo, filter, dispatch }: TodoListProps) => {
  const [editIndex, updateIndex] = useState<null|string>(null);
  const applyFilters = (item: Task) => {
    switch (filter) {
      case "active": {
        return !item.completed;
      }
      case "completed": {
        return item.completed;
      }
      default: {
        return true;
      }
    }
  };

  const todoListItems = todo.filter(applyFilters);
  
  const TodoListTreatment = ({ tasks }: TodoListTreatmentProps) => {
    if (tasks.length) {
      return (
        <>
          {
            tasks.map((item, i) => (
              <TodoListItem 
                item={item}
                key={item.id}
                index={i}
                onEdit={() => updateIndex(item.id)}
                onSubmit={(value) => {
                  dispatch({ type: 'update', id: item.id, value });
                  updateIndex(null);
                  return value;
                }}
                onComplete={() => {
                  console.log(`dispatch invoked`);
                  dispatch({ type: 'completed', id: item.id });
                }}
                edit={editIndex === item.id}
              />
            ))
          }
        </>
      );
    } else {
      return (
        <li>
          <i>No {filter} tasks!</i>
        </li>
      );
    }
  }

  return (
    <ul className="todo-list">
      <TodoListTreatment tasks={todoListItems} />
    </ul>
  );

});


export {
    TodoList
}
