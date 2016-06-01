module.exports = function (socket) {

    function broadcast(type, payload) {
        socket.broadcast.emit(type, payload);
        socket.emit(type, payload);           // What this line does is that it also showes the client that writes
        // the message, what it has written.
    }

    socket.on('message', function (message) {

        var date = new Date();
        var hour = date.getHours();
        var minuts = date.getMinutes();
        var time = hour + ':' + minuts;
        broadcast('message', time + ' (' + socket.username + ') ' + message);

    });

    users = [];

    socket.on('user', function (data, callback) {  // Here it is very importent to also use the name "user" in the js file for the frontend!!!
        if (users.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
            //broadcast('user',data);
        }
        broadcast('user', 'user connected: ' + socket.username);
    });

    socket.on('disconnect', function (data) {
        if (!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        broadcast('user', data);
    });
};