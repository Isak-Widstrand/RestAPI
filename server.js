const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 5000

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "api"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


const crypto = require('crypto'); //använder NodeJS inbyggda krypteringsfunktioner.

function hash(data) {
 const hash = crypto.createHash('sha256');
 hash.update(data);
 return hash.digest('hex')
}

app.get('/users', function(req, res) {
  //kod här för att hantera anrop…
  var sql = "SELECT * FROM users"
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result.length)
    if (result.length === 0) {
      res.status(404).json({
        message: "Users not found"
      });
    } else {
      res.send(result);
    }
  });
});

app.get('/users/:Id', function(req, res) {
  let sql = `SELECT * FROM users WHERE Id = ${req.params.Id}`;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    
    console.log(result, result.length)
    if (result.length === 0) {
      res.status(404).json({
        message: "User not found"
      });
    } else {
      res.send(result);
    }
  });
});

app.post('/users', function(req, res) {
  let sql = `Select * FROM users where Name = '${req.body.Name}'`;
  const Password_hash = hash(password)
  connection.query(sql, function (err, results) {
    if (err) throw err;
    if (results.length === 0){
      let sql = `INSERT INTO users(Name, Username, Password_hash)
      VALUES ('${req.body.Name}', '${req.body.Username}', '${req.body.Password_hash}')`
      connection.query(sql, function(err, result) {
        if (err) throw err;
        //kod här för att hantera returnera data…
        res.send(result);
      });
    } else {
      res.status(400).json({
        message: "User already exists"
      });
    }
  });
});

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUserData = req.body;
  

  connection.query('UPDATE users SET ? WHERE id = ?', [updatedUserData, id], (error, results) => {
    if (error) {
      console.error('Error updating user: ', error);
      res.status(400).send('Could not update user.');
      return;
    }

   
    if (results.affectedRows === 0) {
      res.status(400).send('User not found.');
    } else {
      res.status(200).send('User updated successfully.');
    }
  });
});

app.post('/login', function(req, res) {
  let Username = req.body.Username;
  let Password = req.body.Password;
  let sql = `SELECT * FROM users WHERE username = '${Username}'`;

  connection.query(sql, function (err, results, fields) {
    if (err) throw err;

    if (results.length === 0) {
      res.status(401).json({ message: "Invalid username or password" });
    } else {
      let user = results[0];
      
      if (user.Password_hash === hash(Password)) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  });
});

app.get('/', (req, res) => {
  res.send(`<h1>Dokumentation</h1>
  <ul>
  <li>get from databas users med Id - /users/Id</li>
  <li>get alla users from databas users - /users</li>
  <li>post in i databas till users - post /users</li>
  <li>uppdatera en user i en databas med id - put /users/?</li>
  </ul>`)
})

app.listen(port, () => {
  console.log(`Server is on port ${port}`)
})