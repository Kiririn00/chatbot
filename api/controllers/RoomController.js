/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * RoomController.js
 * back-end handle socket's request from client
 */


module.exports = {

  Join: function (req,res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var socket_id = sails.sockets.getId(req.socket);

    sails.sockets.join(req, socket_id, function(err) {
      if (err) {
        return res.serverError(err);
      }

      console.log(req.socket.rooms);

      return res.json({
        message: 'Subscribed to a fun room called '+socket_id+'!'
      });
    });

  },
  Leave: function () {

  },
  BroadcastMessage: function (req,res) {

    if (!req.isSocket) {
      return res.badRequest();
    }
    var socket_id = sails.sockets.getId(req.socket);
    var msg = req.param('msg');

    sails.sockets.broadcast(socket_id ,{ msg: msg });

  }



};
