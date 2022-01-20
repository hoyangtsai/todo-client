import { ITodo, TodoAction } from '../interfaces/todo.interface';


const todoReducer = (todos: ITodo[], action: TodoAction) => {
  switch (action.type) {
    case 'INIT_TODO':
      return action.payload.todos;
    case 'ADD_TODO':
      return [...todos, action.payload.todo];
    case 'DELETE_TODO':
      return todos.filter((todo) => todo.id !== action.payload.id);
    case 'SHOW_ALL':
      return action.payload.todos;
    case 'SHOW_ACTIVE':
      const activeTodos = action.payload.todos.slice();
      return activeTodos.filter((todo) => !todo.done);
    case 'SHOW_COMPLETED':
      const completeTodos = action.payload.todos.slice();
      return completeTodos.filter((todo) => todo.done);
    case 'EDIT_TODO':
    case 'TOGGLE_TODO':
      const { todo, index } = action.payload;
      return Object.assign([], todos, { [index]: todo });
    case 'SORT_RESET':
      return action.payload.todos;  
    case 'SORT_DESC':
      return action.payload.todos;  
      // const descTodo = action.payload.todos.slice();
      // return descTodo.sort((a, b) => b.weight - a.weight);
    case 'SORT_ASC':
      return action.payload.todos;  
      // const ascTodo = action.payload.todos.slice();
      // return ascTodo.sort((a, b) => a.weight - b.weight);
    default:
      return todos;
  }
};

export default todoReducer;
