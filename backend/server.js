const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collegeWebsite';
const dbName = 'collegeWebsite';
const usersCollection = 'users';
const messagesCollection = 'messages';
const studentDataCollection = 'studentData';

const client = new MongoClient(mongoURI);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

connectToMongo();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', async (req, res) => {
  const { name, email, mobile, state, qualification, discipline, category } = req.body;
  if (!name || !email || !mobile || !state || !qualification || !discipline || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newEntry = {
    name,
    email,
    mobile,
    state,
    qualification,
    discipline,
    category,
    timestamp: new Date().toISOString()
  };

  try {
    const db = client.db(dbName);
    const collection = db.collection(messagesCollection);
    await collection.insertOne(newEntry);
    console.log('Entry saved to MongoDB:', newEntry);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Error saving to MongoDB:', err);
    res.status(500).json({ message: 'Failed to submit form' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection(usersCollection);
    const user = await collection.findOne({ username, password });

    if (user) {
      res.status(200).json({ message: 'Login successful', redirect: '/store-data.html' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/store-data', async (req, res) => {
  const { username, data } = req.body;
  if (!username || !data) {
    return res.status(400).json({ message: 'Username and data are required' });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection(studentDataCollection);
    await collection.insertOne({ username, data, timestamp: new Date().toISOString() });
    console.log('Data stored for:', username);
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (err) {
    console.error('Error storing data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/add-user', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection(usersCollection);
    await collection.insertOne({ username, password });
    console.log('User added:', username);
    res.status(200).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});