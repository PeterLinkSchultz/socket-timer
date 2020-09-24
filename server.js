let express = require('express');
let path = require("path");
let socketio = require('socket.io');
let fs = require("fs");

const users = [];

let app = express();

let server = app.listen(8080, function(){
    console.log('server listening 8080');
});
let io = socketio.listen(server, {
    pingInterval: 1000,
    serveClient: true,
});
io.on('disconnect', function(){
    console.log('user disconnected io!');
});
io.sockets.on('connection', (socket) => {
    console.log('connection user!');

    socket.on('admin:connect', () => {
        io.emit('timer:current');
        fs.readFile('session.txt', 'utf8', (err, data) => {
            if (err) throw err;
            io.emit('admin:log', data);
        });
    });

    socket.on('timer:signal', () => {
        io.emit('timer:outSignal');
    });

    socket.on('timer:time', (data) => {
       io.emit('timer:setTime', data);
    });

    socket.on('timer:start', (data) => {
        console.log('timer: start');
        io.emit('timer:start', data);
    });

    socket.on('timer:stop', () => {
        console.log('timer: stop');
        io.emit('timer:stop');
    });

    socket.on('timer:reset', () => {
        console.log('timer: reset');
        fs.writeFile('session.txt', '', (err) => {
            if (err) throw err;
        });
        io.emit('timer:reset');
    });

    socket.on('info:set', (data) => {
        console.log(data);
        let text = "Chain: [" + data.chain + "] ";
            text += "Timer: [" + data.timer + "] ";
            text += "Time: [" + data.time + "]\n";

        fs.appendFile('session.txt', `${JSON.stringify(data)}\n`, 'utf8', (err) => {
            if (err) throw err;
            console.log('Data added to session!');
        });
        fs.appendFile('log.txt', text, 'utf8', (err) => {
            if (err) throw err;
            console.log('Data added to log!');
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
app.get('/*.png', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/img/"+req.originalUrl));
});
app.get('/*.jpg', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/img/"+req.originalUrl));
});
app.get('/*.jpeg', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/img/"+req.originalUrl));
});
app.get('/*.css', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/style/"+req.originalUrl));
});
app.get('/*.woff', function (req, res) {
    res.sendFile(path.join(__dirname+"/dist/style/"+req.originalUrl));
});
app.get('/*.woff2', function (req, res) {
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
app.get('/data/sp', function (req, res) {
    res.sendFile(path.join(__dirname+'/rooms_sp.json'));
});
app.get('/data/cat', function (req, res) {
    res.sendFile(path.join(__dirname+'/rooms_cat.json'));
});