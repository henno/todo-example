document.addEventListener('DOMContentLoaded', () => {
  const addTodoBtn = document.getElementById('add-todo-btn');
  const addTodoFormContainer = document.getElementById('add-todo-form-container');
  const addTodoForm = document.getElementById('add-todo-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const todoList = document.getElementById('todo-list');
  const filterInput = document.getElementById('filter-input');
  
  // Function to set up button event listeners
  const setupButtonEventListeners = () => {
    // Set up complete buttons
    document.querySelectorAll('.complete-btn').forEach(button => {
      button.addEventListener('click', handleCompleteClick);
    });
    
    // Set up incomplete buttons
    document.querySelectorAll('.incomplete-btn').forEach(button => {
      button.addEventListener('click', handleIncompleteClick);
    });
  };
  
  // Function to filter todo items
  const filterTodoItems = (searchText) => {
    const todoItems = document.querySelectorAll('.todo-item');
    const searchTerms = searchText.toLowerCase().trim().split(/\s+/);
    
    todoItems.forEach(item => {
      const todoText = item.querySelector('.todo-text').textContent.toLowerCase();
      
      // Check if all search terms are present in the todo text
      const isMatch = searchTerms.every(term => todoText.includes(term));
      
      if (isMatch || searchText === '') {
        item.classList.remove('hidden-by-filter');
      } else {
        item.classList.add('hidden-by-filter');
      }
    });
  };

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
      li.innerHTML = `
        <span class="todo-text">${newTodo.text}</span>
        <button class="complete-btn" data-id="${newTodo.id}">Complete</button>
      `;
      todoList.appendChild(li);
      
      // Add event listener to the new complete button
      li.querySelector('.complete-btn').addEventListener('click', handleCompleteClick);
      
      // Apply current filter to new item
      if (filterInput.value.trim() !== '') {
        filterTodoItems(filterInput.value);
      }
      
      // Reset and hide the form
      addTodoForm.reset();
      addTodoFormContainer.classList.add('hidden');
      
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo item. Please try again.');
    }
  });
  
  // Handle click on complete button
  async function handleCompleteClick(e) {
    const button = e.target;
    const todoId = button.dataset.id;
    const todoItem = button.closest('.todo-item');
    
    try {
      const response = await fetch(`/api/todos/${todoId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
      
      const updatedTodo = await response.json();
      
      // Update the UI
      todoItem.classList.add('completed');
      button.remove();
      
      // Add the incomplete button
      const incompleteBtn = document.createElement('button');
      incompleteBtn.className = 'incomplete-btn';
      incompleteBtn.dataset.id = todoId;
      incompleteBtn.textContent = 'Mark as not completed';
      incompleteBtn.addEventListener('click', handleIncompleteClick);
      todoItem.appendChild(incompleteBtn);
      
    } catch (error) {
      console.error('Error completing todo:', error);
      alert('Failed to mark todo as completed. Please try again.');
    }
  }
  
  // Handle click on incomplete button
  async function handleIncompleteClick(e) {
    const button = e.target;
    const todoId = button.dataset.id;
    const todoItem = button.closest('.todo-item');
    
    try {
      const response = await fetch(`/api/todos/${todoId}/incomplete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark todo as not completed');
      }
      
      const updatedTodo = await response.json();
      
      // Update the UI
      todoItem.classList.remove('completed');
      button.remove();
      
      // Add the complete button
      const completeBtn = document.createElement('button');
      completeBtn.className = 'complete-btn';
      completeBtn.dataset.id = todoId;
      completeBtn.textContent = 'Complete';
      completeBtn.addEventListener('click', handleCompleteClick);
      todoItem.appendChild(completeBtn);
      
    } catch (error) {
      console.error('Error marking todo as not completed:', error);
      alert('Failed to mark todo as not completed. Please try again.');
    }
  }
  
  // Set up filter input event listener
  filterInput.addEventListener('input', (e) => {
    filterTodoItems(e.target.value);
  });
  
  // Clear filter when navigating between views
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterInput.value = '';
    });
  });
  
  // Initialize buttons when page loads
  setupButtonEventListeners();
});