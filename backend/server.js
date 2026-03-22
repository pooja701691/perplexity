require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
app.use(express.json());

connectDB();

// routes
app.use('/api/auth', require('./src/routes/auth.routes'));

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});