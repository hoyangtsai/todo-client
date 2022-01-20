import React, { useReducer, useEffect, useCallback, useState } from 'react';
import todoReducer from '../reducers/todo.reducer';
import { ITodo } from '../interfaces/todo.interface';
import axios from 'axios';
import AddTodo from '../components/AddTodo';
import styles from './Todo.module.scss';
import clsx from 'clsx';
import TodoWeight from './TodoWeight';

const { REACT_APP_API_HOST, REACT_APP_API_TODO } = process.env;

const TODO_API_URL = `${REACT_APP_API_HOST}/${REACT_APP_API_TODO}`;

const Todo = () => {
  const [originTodos, setOriginTodos] = useState<ITodo[]>([]);

  const [todos, dispatch] = useReducer(todoReducer, []);
  const [visible, setVisible] = useState('all');
  const [sort, setSort] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const todos = await getTodos();
      dispatch({ type: 'INIT_TODO', payload: { todos } });
      setOriginTodos(todos);
    }
    init();
  }, []);

  const getTodos = async (params: any = {}) => {
    let qs = '';
    if (Object.keys(params).length > 0) {
      // convert objec to a query string
      qs = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
    }
    try {
      const res = await axios.get(`//${TODO_API_URL}/all?${qs}`);
      const { data, status } = res;
      if (status === 200) {
        return data;
      }
    } catch (err) {
      console.log('get todos error =>', err);
    }
  }

  const updateTodo = async (todo: ITodo) => {
    if (todo.id) {
      try {
        const res = await axios.put(`//${TODO_API_URL}/${todo.id}`, todo);
        return res;
      } catch (err) {
        if (err instanceof Error) {
          console.log('updateTodo err =>', err.message);
        }
      }
    }
    return Promise.reject('TodoId not existed.');
  }

  const handleNewTodo = useCallback((todo: ITodo) => {
    dispatch({ type: 'ADD_TODO',
      payload: {
        todo: { ...todo, isEdit: false }
      }
    });
    setOriginTodos((prev) => [...prev, todo]);
  }, []);

  const handleDone = async (e: React.ChangeEvent<HTMLInputElement>, todo: ITodo, index: number) => {
    const toggled = { ...todo, done: !todo.done };
    const res = await updateTodo(toggled);
    const { data, status } = res;
    if (status === 200) {
      dispatch({ type: 'TOGGLE_TODO', payload: { todo: toggled, index }});
      setOriginTodos((prevSate) => prevSate.map((prev) => {
        if (prev.id === data.id) {
          return { ...prev, done: !prev.done };
        }
        return prev;
      }));
    }
  }

  const clickDelete = async (e: React.MouseEvent<HTMLButtonElement>, todo: ITodo) => {
    if (todo.id) {
      try {
        const res = await axios.delete(`//${TODO_API_URL}/${todo.id}`);
        const { id } = res.data;
        dispatch({ type: 'DELETE_TODO', payload: { id } });
        setOriginTodos((prevSate) => prevSate.filter((prev) => prev.id !== id));
      } catch (err) {
        console.log('handleDelete error =>', err);
      }
    }
  }

  const clickEdit = (e: React.MouseEvent<HTMLButtonElement>, todo: ITodo, index: number) => {
    if (todo.id) {
      if (todo.isEdit) {
        handleTodoEditDone(todo, index);
      } else {
        const edited = { ...todo, isEdit: !todo.isEdit };
        dispatch({ type: 'EDIT_TODO', payload: { todo: edited, index }});
      } 
    }
  }

  const handleTodoNameChange = (e: React.ChangeEvent<HTMLInputElement>, todo: ITodo, index: number) => {
    if (todo.id && e.target.value) {
      const edited = { ...todo, name: e.target.value };
      dispatch({ type: 'EDIT_TODO', payload: { todo: edited, index }});
    }
  }

  const handleTodoEditDone = async (todo: ITodo, index: number) => {
    if (todo.id) {
      const edited = { ...todo, isEdit: false };
      const res = await updateTodo(edited);
      const { data, status } = res;

      if (status === 200) {
        dispatch({ type: 'EDIT_TODO', payload: { todo: edited, index }});
        setOriginTodos((prevSate) => prevSate.map((prev) => {
          if (prev.id === data.id) {
            return edited;
          }
          return prev;
        }));
      }
    }
  }

  const handleTodoNameKeyup = async (e: React.KeyboardEvent<HTMLInputElement>, todo: ITodo, index: number) => {
    if (e.key === 'Enter' || e.keyCode === 13) { 
      handleTodoEditDone(todo, index);
    }
  }

  const handleEditWeight = useCallback((weight: number, todo: ITodo, index: number) => {
    if (todo.id) {
      const edited = { ...todo, weight };
      dispatch({ type: 'EDIT_TODO', payload: { todo: edited, index }});
    }
  }, [dispatch])

  const handleSort = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (sort === '' || sort === 'asc') {
      setSort('desc')
    } else if (sort === 'desc') {
      setSort('asc')
    }
  }

  useEffect(() => {
    if (visible.toLowerCase() === 'all') {
      dispatch({ type: 'SHOW_ALL', payload: { todos: originTodos }});
    } else if (visible.toLowerCase() === 'active') {
      dispatch({ type: 'SHOW_ACTIVE', payload: { todos: originTodos }});
    } else if (visible.toLowerCase() === 'completed') {
      dispatch({ type: 'SHOW_COMPLETED', payload: { todos: originTodos }});
    }
  }, [visible, originTodos]);

  useEffect(() => {
    const setTodoSort = async (sort = '') => {
      if (sort === '') {
        // dispatch({ type: 'SORT_RESET', payload: { todos: originTodos }});
        const todos = await getTodos();
        dispatch({ type: 'SORT_RESET', payload: { todos } });
        setOriginTodos(todos);
      } else if (sort === 'asc') {
        // dispatch({ type: 'SORT_DESC', payload: { todos } });
        const todos = await getTodos({ sort });
        dispatch({ type: 'SORT_DESC', payload: { todos } });
      } else if (sort === 'desc') {
        // dispatch({ type: 'SORT_ASC', payload: { todos } });
        const todos = await getTodos({ sort });
        dispatch({ type: 'SORT_ASC', payload: { todos } });
      }
    }

    setTodoSort(sort);
  }, [sort]);


  const getListItem = (t: ITodo, index: number) => {
    if (visible === 'active' && t.done) return;
    if (visible === 'completed' && !t.done) return;
    return (
      <li className={clsx(styles.todoItem, { [styles.isDone]: t.done, [styles.isEdit]: t.isEdit })} key={t.id}>
        <input type="checkbox" title="toggle-done"
          className={styles.todoCheck} checked={t.done}
          onChange={(e) => handleDone(e, t, index)} />
        {t.isEdit ?
          <input className={styles.todoNameInput} title="todo-name" type="text"
            value={t.name}
            onChange={e => handleTodoNameChange(e, t, index)}
            onBlur={e => handleTodoEditDone(t, index)}
            onKeyUp={e => handleTodoNameKeyup(e, t, index)} /> :
          <span className={styles.todoName}>{t.name}</span>
        }
        {t.isEdit ?
          <TodoWeight className={styles.todoWeight__select} weight={t.weight} onWeightChange={(w: number) => handleEditWeight(w, t, index)} /> :
          <span className={styles.todoWeight}>{t.weight}</span>
        }
        <span className={styles.todoCtrl}>
          <button className="todoEdit" onClick={(e) => clickEdit(e, t, index)}>✏️</button>
          <button className="todoDel" onClick={(e) => clickDelete(e, t)}>🗑</button>
        </span>
      </li> 
    )
  }

  return (
    <div>
      <AddTodo onNewTodo={handleNewTodo} />
      <div className={styles.todoFilter}>
        <span className={styles.todoFilter__title}>Show:</span>
        <button className={clsx(styles.todoFilter__linkButton, { [styles.isSelect]: visible === 'all' })} onClick={e => setVisible('all')}>All</button>
        <button className={clsx(styles.todoFilter__linkButton, { [styles.isSelect]: visible === 'active' })} onClick={e => setVisible('active')}>Active</button>
        <button className={clsx(styles.todoFilter__linkButton, { [styles.isSelect]: visible === 'completed' })} onClick={e => setVisible('completed')}>Completed</button>
      </div>
      <div className={styles.todoSort}>
        <span className={styles.todoSort__title}>Sort:</span>
        <button className={styles.todoSort__button} onClick={handleSort}>
          {sort === '' ? 
              'Click to sort' :
              (sort === 'desc' ? 'Ascending' : 'Descending')}
        </button>
        <button className={styles.todoSort__button} onClick={e => setSort('')}>Reset</button>
      </div>
      <ul className={styles.todoList}>
        {todos.map((t: ITodo, index: number) => getListItem(t, index))}
      </ul>
    </div>
  )
}

export default Todo;
