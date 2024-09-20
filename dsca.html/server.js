const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
});

db.connect((err) => {
if (err) {
console.error('error connecting:', err);
return;
}
console.log('connected as id ' + db.threadId);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login route
app.post('/login', (req, res) => {
console.log('Login route executed');
const username = req.body.username;
const password = req.body.password;

if (!username || !password) {
res.status(400).send({ message: 'Username and password are required' });
return;
}

db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
if (err) {
console.error('error running query:', err);
res.status(500).send({ message: 'Error logging in' });
} else if (results.length === 0) {
res.status(401).send({ message: 'Invalid username or password' });
} else {
const storedHashedPassword = results[0].password;
bcrypt.compare(password, storedHashedPassword, (err, isValid) => {
if (err) {
console.error('error comparing passwords:', err);
res.status(500).send({ message: 'Error logging in' });
} else if (!isValid) {
res.status(401).send({ message: 'Invalid username or password' });
} else {
// Login successful, generate token or session
res.send({ message: 'Logged in successfully' });
}
});
}
});
});

// Register route
app.post('/register', (req, res) => {
console.log('Register route executed');
const username = req.body.username;
const email = req.body.email;
const password = req.body.password;

if (!username || !email || !password) {
res.status(400).send({ message: 'Username, email, and password are required' });
return;
}

bcrypt.hash(password, 10, (err, hashedPassword) => {
if (err) {
console.error('error hashing password:', err);
res.status(500).send({ message: 'Error registering user' });
} else {
db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
if (err) {
console.error('error inserting user:', err);
res.status(500).send({ message: 'Error registering user' });
} else {
res.send({ message: 'User registered successfully' });
}
});
}
});
});

app.listen(8080, () => {
console.log('Server listening on port 8080');
});


