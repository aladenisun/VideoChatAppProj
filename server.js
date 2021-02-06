const express = require('express');
const app = express();
const httpserver = require('http').createServer(app);
const io = require('socket.io')(httpserver);

// sets up port and if port not available, sets another port
const port = process.env.PORT || 3001;
; 

//http listening on port 3001
httpserver.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});


//serves the index.html file to the client side : Router
app.get('/' , (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

//client is the name of the folder that out client files are
app.use(express.static('client'));
app.use(express.static('views'));


io.on('connection', (socket) => {
  // console.log('client is connected ' + socket.id);

    socket.on('userMessage', (data) => {
    //broadcasts the data to other all sockets
    io.emit('userMessage', data);
    });

    socket.on('userTyping', (data) => {
        //broadcasts data to everyone but the sender
        socket.broadcast.emit('userTyping', data);
    });
});


