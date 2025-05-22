document.addEventListener('DOMContentLoaded', () => {
  const addTodoBtn = document.getElementById('add-todo-btn');
  const addTodoFormContainer = document.getElementById('add-todo-form-container');
  const addTodoForm = document.getElementById('add-todo-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const todoList = document.getElementById('todo-list');

  // Show form when "Add Todo" button is clicked
  addTodoBtn.addEventListener('click', () => {
    addTodoFormContainer.classList.remove('hidden');
    document.getElementById('todo-text').focus();
  });

  // Hide form when Cancel button is clicked
  cancelBtn.addEventListener('click', () => {
    addTodoFormContainer.classList.add('hidden');
    addTodoForm.reset();
  });

  // Handle form submission
  addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const todoText = document.getElementById('todo-text').value.trim();
    
    if (!todoText) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: todoText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const newTodo = await response.json();
      
      // Add the new todo to the list
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = newTodo.id;
      li.innerHTML = `<span class="todo-text">${newTodo.text}</span>`;
      todoList.appendChild(li);
      
      // Reset and hide the form
      addTodoForm.reset();
      addTodoFormContainer.classList.add('hidden');
      
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo item. Please try again.');
    }
  });
});