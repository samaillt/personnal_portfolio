const port = 8100;
const ip = "0.0.0.0";

const fs = require('fs');
const main_conf = JSON.parse(fs.readFileSync(__dirname + '/conf/main.json', 'utf8'));

const express = require('express')
const three = require('three');
const app = express();

const reactViews = require("express-react-views");
app.set('views', __dirname + '/views');
app.set('view engine', 'js');
app.engine('js', reactViews.createEngine());

app.use('/three', express.static(__dirname + '/node_modules/three/build'))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname + '/public/conf'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

app.get('/', (req, res) => {
  res.render('html', main_conf.fr);
});

app.get('/en', (req, res) => {
  res.render('html', main_conf.en);
});

app.listen(port, ip, () => {
  console.log('App listening on port ' + port)
});