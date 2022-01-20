import './App.scss';
import Todo from './components/Todo';

// read .env file
// require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
      </header>
      <main>
        <Todo />
      </main>
    </div>
  );
}

export default App;
