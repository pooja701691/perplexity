const express = require('express');

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', require('./src/routes/auth.routes'));

// default route
app.get('/', (req, res) => {
  res.send("API is running...");
});

module.exports = app;