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
app.engine('handlebars', engine());
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});