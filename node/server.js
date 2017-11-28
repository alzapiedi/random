import express from 'express';
import cookieParser from 'cookie-parser';

var app = express();
// app.use(cookieParser());

app.use(function(req, res, next) {
  req.cookies = {};
  req.headers.cookie.split(';')
  .map(function (el) {
    return el.split('=');
  })
  .forEach(function(el) {
    req.cookies[el[0]] = el[1]
  });
  next();
});

app.get('/', function (req, res) {
  res.set('Hello', 'you bitch');
  res.end();
});

app.listen(8020);
