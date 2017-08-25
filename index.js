var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/", express.static(__dirname +"/"));

io.on('connection', function(socket){
  io.emit('message', "a user connected");
  console.log(socket.id + " connected");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
