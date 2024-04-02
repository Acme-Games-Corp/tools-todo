import { useTodoState } from "./Todo/useTodoState";
import { TodoList } from "./Todo/TodoList"
import { TodoForm } from "./Todo/TodoForm";
import { FilterButtons } from "./Todo/FilterButtons";
import "./App.css";

function App() {
  const defaultState = { todo: [
    { value: "Take out the trash", completed: false },
    { value: "Do the dishes", completed: false }
  ], filter: null };
  const [state, dispatch] = useTodoState(defaultState);
  return (
    <div className="App">
      <main className="App-header">
        <h1>
          TODO
          <FilterButtons filter={state.filter} dispatch={dispatch} />
        </h1>
        <TodoList todo={state.todo} filter={state.filter} dispatch={dispatch} />
        <ul className={`listControls`}>
          <li>
            <TodoForm placeholder="Add a new todo" onSubmit={(newValue) => {
              dispatch({ type: 'new', newItem: newValue });
              return '';
            }} />
          </li>
          {
            state.todo.find(item => item.completed) && (<li><button onClick={() => dispatch({ type: 'clearCompleted' })}>Clear completed</button></li>)
          }
        </ul>
      </main>
    </div>
  );
}

export default App;
