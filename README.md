# NIT Trichy Portal

A simple and secure full-stack web application for managing feedback, student data, and internal communication at NIT Trichy.

---

## 🔧 Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Tools:** Postman, Git, VS Code

---

## 📁 Folder Structure

```
project-root/
├── public/            # Frontend files (HTML, CSS, JS)
├── backend/           # Express server and routes
├── .env               # Environment variables
├── package.json       # Node dependencies
└── server.js          # Main backend file
```

---

## 🚀 Features

* Student login and feedback submission
* Admin login to manage all submissions
* Store, update, delete student entries
* Contact form with message storage

---

## 🔌 How to Run

1. Install Node.js & MongoDB
2. Clone the repository
3. Run `npm install`
4. Create a `.env` file with:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/collegeWebsite
   ```
5. Run backend: `node backend/server.js`
6. Open `public/index.html` in browser or use Live Server

---

## 📬 API Routes

| Method | Route                 | Function             |
| ------ | --------------------- | -------------------- |
| POST   | /login                | User login           |
| POST   | /store-data           | Store student data   |
| GET    | /get-data             | Fetch student data   |
| POST   | /contact-submit       | Submit feedback      |
| GET    | /admin/messages       | Admin view messages  |
| POST   | /admin/delete-message | Admin delete message |

---

## 📈 Future Enhancements

* Add JWT-based authentication
* Password encryption
* Admin role management

---
