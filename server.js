const express = require('express')
const mysql = require('mysql')
const app = express()

const swimmers = [
    { id: 1, name: 'Adam Peaty', country: 'Storbritannien', spec: 'Bröstsim' },
    { id: 2, name: 'Caeleb Dressel', country: 'USA', spec: 'Frisim' },
    { id: 3, name: 'Sarah Sjöström', country: 'Sverige', spec: 'Fjärilssim' }
];

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

app.get('/swimmers', (req, res) => {
    res.send(swimmers);
});

app.get('/swimmers/:id', (req, res) => {
    const swimmer = swimmers.find(s => s.id === parseInt(req.params.id));
    if (!swimmer) return res.status(404).send('Swimmer not found');
    res.send(swimmer);
});

app.get('/search', (req, res) => {
  const query = req.query
  res.send(`Sökresultat: ${JSON.stringify(query)}`)
})

app.get('/users', function(req, res) {
  //kod här för att hantera anrop…
  var sql = "SELECT * FROM users"
  con.query(sql, function(err, result, fields) {
    if (err) throw err
    res.json(result)
  });
});

app.get('/users/:Name', function(req, res) {
  let sql = `SELECT * FROM users WHERE Name = '${req.params.Name}'`;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result.length)
    if (result.length === 0) {
      res.status(404).json({
        message: "User not found"
      });
    } else {
      res.send(result);
    }
  });
});

var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/users', function(req, res) {
  let sql = `Select * FROM users where Name = '${req.body.Name}'`;
  connection.query(sql, function (err, results) {
    if (err) throw err;
    if (results.length === 0){
      let sql = `INSERT INTO users(Name, Username, Password)
      VALUES ('${req.body.Name}', '${req.body.Username}', '${req.body.Password}')`
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

app.get('/', (req, res) => {
  res.send(`<h1>Dokumentation</h1>
  <ul><li>get  swimmers - /swimmers</li>
  <li>get swimmer via id - /swimmers/id</li>
  <li>get /search</li>
  <li>get from databas users - /users</li>
  <li>post in i databas till users- post /users</li>
  <li>uppdatera en user i en databas med id- put /users/?</li>
  </ul>`)
})

const port = 5000

app.listen(port, () => {
  console.log(`Server is on port ${port}`)
})