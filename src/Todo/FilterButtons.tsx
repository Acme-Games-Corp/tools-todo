import React, { Dispatch } from "react";
import { Filter, Action } from "./useTodoState";

export interface FilterButtonsType {
  filter: Filter,
  dispatch: Dispatch<Action>
}

const FilterButtons = ({ filter, dispatch }: FilterButtonsType) => (
  <>
    &nbsp;
    <button className={filter === null ? 'filterApplied' : 'filterInactive'} onClick={() => dispatch({ type: 'filterAll' })}>All</button>
    &nbsp;
    <button className={filter === 'active' ? 'filterApplied' : 'filterInactive'} onClick={() => dispatch({ type: 'filterActive' })}>Active</button>
    &nbsp;
    <button className={filter === 'completed' ? 'filterApplied' : 'filterInactive'} onClick={() => dispatch({ type: 'filterCompleted' })}>Completed</button>
  </>
);

export {
  FilterButtons
}