require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// get MongoDB driver connection
const dbo = require('./db/connection');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

// setup the logger
app.use(morgan('tiny', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send([
    {
      title: 'Hello world',
    },
  ]);
});

// Load the /posts routes
app.use('/posts', require('./routes/posts.js'));

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(PORT, () => {
    console.log(`Server running under port: ${PORT}`);
  });
});
