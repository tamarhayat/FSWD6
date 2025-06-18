const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');
const authRouter = require('./routes/auth');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/', authRouter);


// app.use('/posts', postsRouter); // (בהמשך)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
