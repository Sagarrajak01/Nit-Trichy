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

const client = new MongoClient(mongoURI);
const collections = {
  users: 'users',
  messages: 'messages',
  studentData: 'studentData'
};

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

connectToMongo();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const db = client.db(dbName);
    const user = await db.collection(collections.users).findOne({ username, password });

    if (user) {
      res.status(200).json({ message: 'Login successful', redirect: 'store-data.html' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/get-data', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const db = client.db(dbName);
    const data = await db.collection(collections.studentData)
                         .find({ username })
                         .sort({ timestamp: -1 })
                         .toArray();
    res.status(200).json({ data });
  } catch (err) {
    console.error('Error fetching data:', err);
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
    await db.collection(collections.studentData).insertOne({ username, data, timestamp: new Date().toISOString() });
    console.log('Data stored for:', username);
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (err) {
    console.error('Data storage error:', err);
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
    await db.collection(collections.users).insertOne({ username, password });
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

app.post('/get-user-data', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username is required" });

  try {
    const db = client.db(dbName);
    const entries = await db
      .collection(collections.studentData)
      .find({ username })
      .sort({ timestamp: -1 })
      .toArray();

    res.status(200).json({ entries });
  } catch (err) {
    console.error("Fetch user data error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const { ObjectId } = require('mongodb');

app.post('/delete-data', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const db = client.db(dbName);
    await db.collection(collections.studentData).deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

app.post('/update-data', async (req, res) => {
  const { id, data } = req.body;
  if (!id || !data) return res.status(400).json({ message: "ID and data required" });

  try {
    const db = client.db(dbName);
    await db.collection(collections.studentData).updateOne(
      { _id: new ObjectId(id) },
      { $set: { data, timestamp: new Date().toISOString() } }
    );
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

app.post('/contact-submit', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = client.db(dbName);
    await db.collection(collections.messages).insertOne({
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form submission error:', err);
    res.status(500).json({ message: 'Failed to submit message' });
  }
});

app.get('/admin/messages', async (req, res) => {
  try {
    const db = client.db(dbName);
    const messages = await db.collection(collections.messages)
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

app.post('/admin/delete-message', async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: 'ID required' });

  try {
    const db = client.db(dbName);
    await db.collection(collections.messages).deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

