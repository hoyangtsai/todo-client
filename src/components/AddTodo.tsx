import React, { useState, useCallback } from 'react';
import axios from 'axios';
import TodoWeight from './TodoWeight';
import styles from './AddTodo.module.scss';

// const { REACT_APP_API_HOST, REACT_APP_API_TODO } = process.env;

// const TODO_API_URL = `${REACT_APP_API_HOST}/${REACT_APP_API_TODO}`;
const TODO_API_URL = `//todo-services.azurewebsites.net/todo`;

interface AddTodoProps {
  onNewTodo: Function;
}

const AddTodo: React.FC<AddTodoProps> = ({ onNewTodo }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!name) return;
    e.preventDefault();
    const newTodo = { name, done: false, weight };
    try {
      const res = await axios.post(`//${TODO_API_URL}/add`, newTodo);
      const { data, status } = res;
      if (status === 200) {
        onNewTodo(data);
        setName('');
        setWeight(0);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log('newTodo err =>', err);
      }
    }
  }

  const handleWeightChange = useCallback((newWeight) => {
    setWeight(newWeight);
  }, [setWeight])

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.todoInput}
        placeholder='Typing a task...'
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <TodoWeight className={styles.todoWeight} weight={weight} onWeightChange={handleWeightChange} />
      <button className={styles.addButton} type="submit">Add</button>
    </form>
  );
};

export default AddTodo;