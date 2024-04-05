import { useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';
import { appID } from "../appID";

export interface Task {
  value: string,
  completed: boolean,
  id: string
}

export type Filter = null | 'active' | 'completed'

export interface State {
  todo: Task[],
  filter: Filter,
  restored?: boolean,
}

export type Action = { type: 'new', newItem: string }
  | { type: 'filterActive' }
  | { type: 'filterCompleted' }
  | { type: 'filterAll' }
  | { type: 'clearCompleted' }
  | { type: 'completed', id: number }
  | { type: 'update', value: string, id: number }
  | { type: 'restore', todo: Task[] }

const channel = new BroadcastChannel('acme-todo');

const updateTodoStorage = (todos: Task[]) => {
  localStorage.setItem('todo', JSON.stringify(todos));
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'new',
        appID
      });
      const todo = [...state.todo, { value: action.newItem, completed: false, id: uuidv4() }];
      updateTodoStorage(todo);
      return {...state, todo};
    }
    case "filterActive": {
      return {...state, filter: 'active'};
    }
    case "filterCompleted": {
      return {...state, filter: 'completed'};
    }
    case "filterAll": {
      return {...state, filter: null};
    }
    case "clearCompleted": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'clear',
        appID
      });
      const todo = state.todo.filter(item => !item.completed);
      updateTodoStorage(todo);
      return {...state, todo};
    }
    case "completed": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'complete',
        appID
      });
      const todo = state.todo.map((item, i) => i === action.id ? { ...item, completed: !item.completed } : item);
      updateTodoStorage(todo);
      return {...state, todo};
    }
    case "update": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'update',
        appID
      });
      const todo = state.todo.map((item, i) => i === action.id ? { ...item, value: action.value } : item);
      updateTodoStorage(todo);
      return {...state, todo};
    }
    case "restore": {
      return { ...state, restored: true, todo: action.todo }
    }
  }
}

const restoreFromStorage = (dispatch: React.Dispatch<Action>) => {
  const rawValues = localStorage.getItem('todo');
  if (rawValues === null) {
    return;
  }
  const rawObject = JSON.parse(rawValues);
  if (rawObject.length === undefined) {
    return;
  }
  dispatch({ type: 'restore', todo: rawObject as Task[] });
};

const useTodoState = (defaultState: State) => {
  const reducerHook = useReducer(reducer, defaultState);
  const [state, dispatch] = reducerHook;
  if (state.restored) {
    return reducerHook;
  }
  restoreFromStorage(dispatch);
  return reducerHook;
}

export {
  useTodoState,
  restoreFromStorage
};
