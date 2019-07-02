var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var parseurl = require('parseurl');
var app = express();

// Use the session middleware
app.use(session({
  name: 'cookiename',
  secret: 'secretkey',
  store: new FileStore({ path : "./../sessions"}),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(function (req, res, next) {
  console.log('id', req.session.id)
  console.log('cookie', req.headers.cookie)
  //console.log(req.session.cookie)
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  console.log(req.session.views[pathname])
  next()
})

app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
// Access the session as req.session
app.get('/', function(req, res, next) {
  res.send('/foo or /bar')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
