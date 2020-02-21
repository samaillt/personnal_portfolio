const port = 8100;
const ip = "0.0.0.0";

const express = require('express')
var three = require('three');
const app = express();

app.use('/three', express.static(__dirname + '/node_modules/three/build'))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname + '/public/conf'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.get('/en', (req, res) => {
  res.sendFile(__dirname + "/public/main_en.html");
});

app.listen(port, ip, () => {
  console.log('App listening on port ' + port)
});