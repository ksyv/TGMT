var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose'); // Import mongoose
const dotenv = require('dotenv').config(); // Import dotenv
const cors = require('cors');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE)
  .then(() => console.log('Connection à MongoDB OK...'))
  .catch(() => console.log('Echec de connection à MongoDB...'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes'); // Importer userRoutes
var gameRouter = require('./routes/gameRoutes'); // Importer gameRoutes
var tableRouter = require('./routes/tableRoutes'); // Importer tableRoutes

var app = express();
// Middleware pour autoriser toutes les origines en développement
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes principaux
app.use('/', indexRouter);
app.use('/users', usersRouter); // Utiliser userRoutes sur le chemin '/users'
app.use('/api/games', gameRouter); // Utiliser gameRoutes sur le chemin '/games'
app.use('/api/tables', tableRouter); // Utiliser tableRoutes sur le chemin '/tables'
app.use('/api/favorites', favoriteRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;