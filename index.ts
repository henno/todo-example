import express from 'express';
import { engine } from 'express-handlebars';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { todoStore } from './src/store';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Set up Handlebars
app.engine('handlebars', engine({
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
  const todos = todoStore.getAllTodos();
  res.render('home', { todos });
});

// API routes
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  const newTodo = todoStore.addTodo(text.trim());
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id/complete', (req, res) => {
  const { id } = req.params;
  
  const updatedTodo = todoStore.markAsCompleted(id);
  
  if (!updatedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json(updatedTodo);
});

app.patch('/api/todos/:id/incomplete', (req, res) => {
  const { id } = req.params;
  
  const updatedTodo = todoStore.markAsNotCompleted(id);
  
  if (!updatedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json(updatedTodo);
});

// Routes for filtering todos
app.get('/completed', (req, res) => {
  const completedTodos = todoStore.getCompletedTodos();
  res.render('home', { todos: completedTodos, view: 'completed' });
});

app.get('/incomplete', (req, res) => {
  const incompleteTodos = todoStore.getIncompleteTodos();
  res.render('home', { todos: incompleteTodos, view: 'incomplete' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});