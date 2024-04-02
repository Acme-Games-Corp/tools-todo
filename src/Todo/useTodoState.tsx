import { useReducer} from "react";

export interface Task {
  value: string,
  completed: boolean,
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

const useTodoState = (defaultState: State) => {
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "new": {
        return {...state, todo: [...state.todo, { value: action.newItem, completed: false }]};
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
        return {...state, todo: state.todo.filter(item => !item.completed)};
      }
      case "completed": {
        return {...state, todo: state.todo.map((item, i) => i === action.id ? { ...item, completed: !item.completed } : item)};
      }
      case "update": {
        return {...state, todo: state.todo.map((item, i) => i === action.id ? { ...item, value: action.value } : item)};
      }
    }
  }
  return useReducer(reducer, defaultState);
}

export {
  useTodoState
};
