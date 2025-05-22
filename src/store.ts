import { Todo } from './types';

// In-memory store for todos (this would be replaced by a database in a real app)
class TodoStore {
  private todos: Todo[] = [];

  getAllTodos(): Todo[] {
    return [...this.todos];
  }

  addTodo(text: string): Todo {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date()
    };
    
    this.todos.push(newTodo);
    return newTodo;
  }
}

export const todoStore = new TodoStore();