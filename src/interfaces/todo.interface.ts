export interface ITodo {
  id?: string;
  name: string;
  done: boolean;
  weight: number;
  isEdit: boolean;
}

export type DefaultProps = Partial<typeof defaultProps>
const defaultProps = {
  isEdit: false
}

export interface IInitTodo {
  type: 'INIT_TODO';
  payload: { todos: ITodo[] };
}

export interface IDelTodo {
  type: 'DELETE_TODO'
  payload: { id: string }
}

export interface IAddTodo {
  type: 'ADD_TODO';
  payload: { todo: ITodo };
}

export interface IToggleTodo {
  type: 'TOGGLE_TODO' | 'EDIT_TODO';
  payload: { todo: ITodo, index: number };
}

export interface IFilterTodo {
  type: 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';
  payload: { todos: ITodo[] };
}

export interface ISortTodo {
  type: 'SORT_RESET' | 'SORT_DESC' | 'SORT_ASC';
  payload: { todos: ITodo[] };
}

export type TodoAction = IInitTodo | IAddTodo | IToggleTodo | IDelTodo | IFilterTodo | ISortTodo;
