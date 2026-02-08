# 🛠️ IT Ticketing System

A simple **IT Complaint / Ticket Management System** built using **HTML, CSS (Bootstrap), JavaScript, Node.js, Express, and PostgreSQL**.

This application allows **end users** to raise IT-related issues and **admins** to securely manage, assign, and track ticket statuses.

---

## ✨ Features

### 👤 End User
- Raise IT complaints (Keyboard, Mouse, Excel, Network, etc.)
- Clean Bootstrap-based UI with icon-style dropdown
- No visible hostname or IP on UI
- Hostname & IP captured **silently** and sent to backend
- Word-wrapped complaint description
- Simple and fast ticket submission

### 🧑‍💼 Admin
- Secure admin login
- Hard auth guard to prevent direct URL access
- Logged-in admin name displayed
- Auto logout if admin name is missing (bypass prevention)
- View all complaints
- Assign complaints to admins
- Update ticket status:
  - NEW
  - IN_PROGRESS
  - COMPLETED
  - REJECTED
- Logout option when shift is over

---

## 🏗️ Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (Postgres client)

---

## 📁 Project Structure

it-ticketing-system/
│
├── backend/
│ ├── server.js
│ └── db.js
│
├── frontend/
│ ├── user.html
│ ├── admin-login.html
│ ├── admin.html
│ │
│ ├── css/
│ │ └── user.css
│ │
│ ├── js/
│ │ ├── user.js
│ │ └── admin.js
│
└── README.md

for db :
DROP TABLE complaints CASCADE;
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50),
  title VARCHAR(100),
  description TEXT,
  hostname VARCHAR(100),
  ip VARCHAR(50),
  status VARCHAR(20) DEFAULT 'OPEN',
  assigned_to INT REFERENCES admins(id)
);

INSERT INTO admins (name, email, password) VALUES
('ankit', 'ankit@test.com', '123'),
('Admin2', 'admin2@test.com', 'admin123');