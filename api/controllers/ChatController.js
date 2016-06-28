/**
 *
 * @description :: Server-side logic for managing Texts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sails = require('sails');

module.exports = {
	ChatBox: function(req,res){

    return res.view();
  },

  StopSentence: function (req,res) {
    var chat_log = [];
    function receive_data(found,i){
      chat_log[i] = found;
      return chat_log;
    }

    log.find({}).exec(function find(err, found){

      for(var i=0;i<found.length;i++){//loop by all record
        //put mySQL data record to value
        var data_result = receive_data(found[i],i);
      }

      console.log(chat_log);

      return res.json({
        chat_log: chat_log
      });

    });
  }
};

