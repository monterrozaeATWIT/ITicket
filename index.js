const express = require('express');
const path = require('path'); // Add this line to import the path module
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ticketing';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/users', require('./routes/users'));
app.use('/tickets', require('./routes/tickets'));


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
