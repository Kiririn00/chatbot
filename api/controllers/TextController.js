/**
 * TextController
 *
 * @description :: Server-side logic for managing Texts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sails = require('sails');

module.exports = {
	TextChat: function(req,res){
  /*
  * io.on('connection', function(socket){
   socket.on('chat message', function(msg){
   io.emit('chat message', msg);
   });
   });
  * */
    req.socket.on('chat message',function(msg){
      console.log('message: ' + msg);
    });


    return res.view();
  }
};

