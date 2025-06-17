const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
// const postsRouter = require('./routes/posts'); // (בהמשך)

const app = express();
app.use(bodyParser.json());

app.use('/users', usersRouter);
// app.use('/posts', postsRouter); // (בהמשך)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
