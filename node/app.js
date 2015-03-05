var express = require('express');
var http = require('express');
var fs = require('fs');
var morgan = require('morgan');
var exec = require('child_process').exec;
var stream = require('logrotate-stream')

var app = express();

app.set('port', 80);

var toLogFile = stream({ file: './access.log', size: '100k', keep: 1 });
app.use(morgan('combined', {stream: toLogFile}));

function reverseLines(str) {
  var lines = str.trim().split('\n');
  var result = "";
  for (var i = lines.length - 1; i >= 0; i--) {
    result += lines[i] + '\n'
  }
  return result;
}

app.all('*', function(req, res) {
  fs.readFile(__dirname + '/access.log', {encoding: 'utf-8'}, function(err, data) {
    if (err) {
      console.log(err);
      res.send(error);
      return;
    }
    res.writeHeader('Content-Type: text/plain');
    res.write(reverseLines(data));
    res.end();
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
