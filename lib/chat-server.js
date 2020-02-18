const express = require('express');

// socket 


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('public/chat.html');
});

// io.set('flash policy port', 3005)

io.on('connection', function(socket){
  console.log('new user : ', socket.id);
  
  
  socket.on('join',(room)=>{
   
    if(room === 'js'){socket.join('jss',()=>{
      console.log('joined to jsss room');
      
    });}
    if(room === 'css'){socket.join('csss',()=>{
      console.log('joined to csss room');
      
    });}
    
  
  });

  socket.on('chat message', function(msg){
    console.log('msg : ', msg);
    io.emit('chat message', msg);
  });

});

// http.listen(port, function(){
//   console.log('listening on *:' + port);
// });


module.exports = {
    server: app,
    start: port => {
      let PORT = port || process.env.PORT2 || 3333;
      http.listen(PORT, () => console.log('chat server up:', PORT));
    },
  };