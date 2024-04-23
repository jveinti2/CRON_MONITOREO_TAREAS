var app = require('./app');
var debug = require('debug')('Madecentro.Pos.WebApi.Nodejs:server');
var http = require('http');

var io = require('socket.io')(http.createServer(app));

io.on('connection', function(client){
    client.on('join', function(data) {
        client.emit('join', 'ok');
    });
    client.on('disconnect', function(){
        console.log('user disconnected');
    });
});
app.listen(process.env.PORT || '1600');