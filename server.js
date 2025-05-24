const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const newEntry = { name, email, message, timestamp: new Date().toISOString() };
  const filePath = path.join(__dirname, 'messages.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }

    messages.push(newEntry);

    fs.writeFile(filePath, JSON.stringify(messages, null, 2), err => {
      if (err) {
        console.error('Error writing to messages.json', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/'); 
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});