var express = require('express');
var http = require('express');
var fs = require('fs');
var morgan = require('morgan');
var exec = require('child_process').exec;
var stream = require('logrotate-stream')

var app = express();

app.set('port', 7799);
app.enable('trust proxy');

var CUTOFF = 100;

var toLogFile = stream({ file: './access.log', size: '100k', keep: 1 });
app.use(morgan('combined', {stream: toLogFile, skip: function(req, res) {return res.statusCode == 404;}}));

function reverseLines(str) {
  var lines = str.trim().split('\n');
  var result = "";
  var c = 0;
  for (var i = lines.length - 1; i >= 0; i--) {
    result += lines[i] + '\n\n'
    c++;
    if (c >= CUTOFF) {
      break;
    }
  }
  return result;
}

app.get('/favicon.ico', function(req, res) {
  res.status(404).end();
});

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/access.log', {encoding: 'utf-8'}, function(err, data) {
    if (err) {
      console.log(err);
      res.send(error);
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.write(reverseLines(data));
    res.end();
  });
});

app.all('/:pathpath', function(req, res) {
  res.send(req.params.pathpath);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
