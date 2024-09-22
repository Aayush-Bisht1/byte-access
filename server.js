const express = require('express');
const session = require('express-session');
const passport = require('passport');
const auth = require('./routes/auth.routes.js');
const api = require('./controller/auth.controller.js');
const path = require('path');
const ejs = require('ejs');
const app = express();

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(session({ secret: 'byte-access', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render("home");
});
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect('/');
  }
});

app.use('/auth', auth);
app.use('/api', api);

app.listen(3000, () => console.log("Server running on port"));