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
app.use(express.static(__dirname + '/public/assets/font'));
app.use(express.static(__dirname + '/public/assets/img'));
app.use(express.static(__dirname + '/public/conf'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/en', (req, res) => {
  res.redirect('/en/home');
});

app.get('/home', (req, res) => {
  res.render('Html', {...main_conf.fr, page: "home"});
});

app.get('/en/home', (req, res) => {
  res.render('Html', {...main_conf.en, page: "home"});
});

app.get('/projects', (req, res) => {
  res.render('Html', {...main_conf.fr, page: "projects"});
});

app.get('/en/projects', (req, res) => {
  res.render('Html', {...main_conf.en, page: "projects"});
});

app.get('/about', (req, res) => {
  res.render('Html', {...main_conf.fr, page: "about"});
});

app.get('/en/about', (req, res) => {
  res.render('Html', {...main_conf.en, page: "about"});
});

/* Local deployment */
app.listen(port, ip, () => {
  console.log('App listening on port ' + port)
});

/* Always data deployment
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('App listening on port ' + process.env.PORT)
});
*/