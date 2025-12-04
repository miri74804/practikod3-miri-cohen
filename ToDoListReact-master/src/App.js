import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getTodos() {
    try {
      setLoading(true);
      setError(null);
      const todos = await service.getTasks();
      setTodos(todos); 
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return; // מניעת הוספת משימה ריקה
    
    try {
      setError(null);
      await service.addTask(newTodo);
      setNewTodo("");
      await getTodos();
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  }

  async function updateCompleted(todo, isComplete) {
    try {
      setError(null);
      await service.setCompleted(todo.id, isComplete);
      await getTodos();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  }

  async function deleteTodo(id) {
    try {
      setError(null);
      await service.deleteTask(id);
      await getTodos();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input 
            className="new-todo" 
            placeholder="Well, let's take on the day" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={loading}
          />
        </form>
      </header>
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          textAlign: 'center',
          backgroundColor: '#ffe6e6' 
        }}>
          {error}
        </div>
      )}
      
      <section className="main" style={{ display: "block" }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading...
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => {
              return (
                <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                  <div className="view">
                    <input 
                      className="toggle" 
                      type="checkbox" 
                      checked={todo.isComplete || false}
                      onChange={(e) => updateCompleted(todo, e.target.checked)} 
                    />
                    <label>{todo.name}</label>
                    <button 
                      className="destroy" 
                      onClick={() => deleteTodo(todo.id)}
                    ></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}

export default App;