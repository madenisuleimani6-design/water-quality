const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const usersFile = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

function loadUsers() {
  try {
    const raw = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isStrongPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

app.post('/api/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const users = loadUsers();
  const normalizedEmail = email.toLowerCase();
  if (users[normalizedEmail]) {
    return res.status(409).json({ success: false, message: 'This email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[normalizedEmail] = {
    fullName,
    email: normalizedEmail,
    passwordHash: hashedPassword,
    registeredAt: new Date().toISOString()
  };

  saveUsers(users);
  return res.status(201).json({ success: true, message: 'Registration successful.', user: { fullName, email: normalizedEmail } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const users = loadUsers();
  const normalizedEmail = email.toLowerCase();
  const user = users[normalizedEmail];
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  return res.json({ success: true, message: 'Login successful.', user: { fullName: user.fullName, email: user.email } });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Auth server running: http://localhost:${PORT}`);
});
