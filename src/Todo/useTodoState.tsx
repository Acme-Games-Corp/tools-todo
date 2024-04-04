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
}

export type Action = { type: 'new', newItem: string }
  | { type: 'filterActive' }
  | { type: 'filterCompleted' }
  | { type: 'filterAll' }
  | { type: 'clearCompleted' }
  | { type: 'completed', id: number }
  | { type: 'update', value: string, id: number }

const channel = new BroadcastChannel('myChannel');

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'new',
        appID
      });
      return {...state, todo: [...state.todo, { value: action.newItem, completed: false, id: uuidv4() }]};
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
      return {...state, todo: state.todo.filter(item => !item.completed)};
    }
    case "completed": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'complete',
        appID
      });
      return {...state, todo: state.todo.map((item, i) => i === action.id ? { ...item, completed: !item.completed } : item)};
    }
    case "update": {
      // Save to local storage
      // Emit to other tabs
      channel.postMessage({
        type: 'update',
        appID
      });
      return {...state, todo: state.todo.map((item, i) => i === action.id ? { ...item, value: action.value } : item)};
    }
  }
}


const useTodoState = (defaultState: State) => {
  return useReducer(reducer, defaultState);
}

export {
  useTodoState
};
