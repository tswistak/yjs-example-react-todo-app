import { Todo } from './todo';

export function App() {
  return (
    <div className="wrapper">
      <div className="container">
        <div id="welcome">
          <h1>
            <span>OUR SUPERB</span> TODO APP 🦫
          </h1>
        </div>
        <Todo />
      </div>
    </div>
  );
}

export default App;
