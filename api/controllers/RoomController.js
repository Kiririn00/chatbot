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

      //console.log(req.socket.rooms);
      sails.log("Open socket!, create room: "+JSON.stringify(req.socket.rooms));

      return res.json({
        conversation: 'Subscribed to a fun room called '+socket_id+'!'
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

    var feedback_switch = req.param('feedback_switch');

    sails.sockets.broadcast(socket_id, 'conversation' ,{ msg: msg, feedback_switch:feedback_switch});

  }

};
