var socketio = require('socket.io');

var entries = require('../routes/entries');
var Entry = require('./entry');

exports.listen = function(server) {
	io = socketio.listen(server);

	io.sockets.on('connection', function(socket) {
	    socket.on('GetPost', function() {
          var username = entries.getUserName();
          Entry.getRange(0, -1, username, function(err, entries) {
            if (err) return err;
            socket.emit('Posts', {Entries: entries});
          });
      });

      socket.on('AddPost', function(Post) {
          var username = entries.getUserName();
          var entry = new Entry({
            "username": username,
            "date": Post.date,
            "distance": Post.distance,
            "time": Post.time,
            "speed": Post.speed
          });
          entry.save(function(err) {
            if (err) return next(err);
            socket.emit('PostAdded', { success: true , entry: entry});
          });
      });    
	});

}