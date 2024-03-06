const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

const port = 3001

// middlewares
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

const dbConfig = require('./config/database.config');
const { initScheduler } = require('./utils/scheduler');

mongoose.Promise = global.Promise;

/// database connection
mongoose.connect(dbConfig.url).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

initScheduler();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})