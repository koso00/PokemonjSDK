var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jsonfile = require('jsonfile')

var port = process.env.PORT || 8080;

app.use("/", express.static(__dirname +"/"));

io.on('connection', function(socket){
  io.emit('message', "a user connected");
  console.log(socket.id + " connected");

  socket.on('save',function(msg){
    var file = 'sav.json';
    var obj = JSON.parse(msg);

    jsonfile.writeFile(file, obj, function (err) {
      console.error(err)
    })
    console.log("save data")
  });

  socket.on('rewritemap' , function(file,map){
    var obj = JSON.parse(map);

    jsonfile.writeFile(file, obj, function (err) {
      console.error(err)
    })
    console.log("rewrited map "+file)
  })

  socket.on('listmap',function(){
        var walk    = require('walk');
        var files   = [];

        // Walker options
        var walker  = walk.walk('./map', { followLinks: false });

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            if (stat.name.split(".")[1] == "json")
            {
            files.push("map/" + stat.name);
            }
            next();
        });

        walker.on('end', function() {
            io.emit("listmap",files)
            console.log(files);
        });
  })

  socket.on("ini",function(file)
  {
    var fs = require('fs')
    , ini = require('ini')

    var config = ini.parse(fs.readFileSync('assets/' + file, 'utf-8'))
    io.emit("ini",file,config);
  })

});



http.listen(port, function(){
  console.log('listening on *:3000');
});
