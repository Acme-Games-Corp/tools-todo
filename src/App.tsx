import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useTodoState } from "./Todo/useTodoState";
import { TodoList } from "./Todo/TodoList"
import { TodoForm } from "./Todo/TodoForm";
import { FilterButtons } from "./Todo/FilterButtons";
import { appID } from "./appID";
import "./App.css";

function App() {
  const defaultState = { todo: [
    { value: "Take out the trash", completed: false, id: uuidv4() },
    { value: "Do the dishes", completed: false, id: uuidv4() }
  ], filter: null };
  const [state, dispatch] = useTodoState(defaultState);
  useEffect(() => {
    const channel = new BroadcastChannel('myChannel');
    const listener = (m: MessageEvent) => {
      if (m.data.appID === appID) {
        return;
      }
      console.log(`Received message from other document. This is App ${appID}`, m);
    }
    channel.addEventListener('message', listener);
    return () => {
      channel.removeEventListener('message', listener);
    };
  }, []);
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
