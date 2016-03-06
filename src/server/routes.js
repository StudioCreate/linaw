// load modules
var app = require('./server.js').app;

/**
 * one page app
 * one route FTW
 */
app.get('/', function(req, res) {
  res.render('index');
});
