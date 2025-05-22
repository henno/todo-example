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

  markAsCompleted(id: string): Todo | null {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return null;
    }
    
    this.todos[todoIndex].completed = true;
    return this.todos[todoIndex];
  }
  
  markAsNotCompleted(id: string): Todo | null {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return null;
    }
    
    this.todos[todoIndex].completed = false;
    return this.todos[todoIndex];
  }
  
  deleteTodo(id: string): boolean {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return false;
    }
    
    this.todos.splice(todoIndex, 1);
    return true;
  }
  
  getCompletedTodos(): Todo[] {
    return this.todos.filter(todo => todo.completed);
  }
  
  getIncompleteTodos(): Todo[] {
    return this.todos.filter(todo => !todo.completed);
  }
}

export const todoStore = new TodoStore();