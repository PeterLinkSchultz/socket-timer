let express = require('express');
let path = require('path');
let socketio = require('socket.io');
let fs = require('fs');


let app = express();

let server = app.listen(8080, function(){
    console.log('server listening 8080');
});
let io = socketio.listen(server, {
    pingInterval: 1000,
    serveClient: true,
});
io.on('disconnect', function(){
    console.log('user disconnected');
});
io.sockets.on('connection', (socket) => {
    console.log('connection user!');

    socket.on('timer:start', () => {
        console.log('timer: start');
        io.emit('timer:start');
    });
    socket.on('timer:stop', () => {
        console.log('timer: stop');
        io.emit('timer:stop');
    });
    socket.on('timer:reset', () => {
        console.log('timer: reset');
        io.emit('timer:reset');
    });
    socket.on('info:set', (data) => {
        console.log(data);
        let text = "Chain: [" + data.chain + "] ";
            text += "Timer: [" + data.timer + "] ";
            text += "Time: [" + data.time + "]\n"
        fs.appendFile('log.txt', text, 'utf8', (err) => {
            if (err) throw err;
            console.log('Данные были добавлены в конец файла!');
        });
       io.emit('info:set', data);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected!');
    });
});

app.get('/*.mp3', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/"+req.originalUrl));
});
app.get('/*.js', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/js/"+req.originalUrl));
});
app.get('/*.css', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/style/"+req.originalUrl));
});
app.get('/index', function (req, res) {
   res.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname+'/dist/admin.html'));
});
app.get('/data', function (req, res) {
    res.sendFile(path.join(__dirname+'/rooms.json'));
});