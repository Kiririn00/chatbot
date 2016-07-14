/**
 *
 * @description :: Server-side logic for managing Texts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jquery = require('jquery');
var request = require('request');



module.exports = {

  Debug: function (req,res) {

    sails.sockets.emit('hi', 'everyone'); // short form    var check = callbackDebug();

    res.locals.layout = 'debug_layout';
    return res.view();
  },

  //show view of chat box(for test chat or debug)
	ChatBox: function(req,res){

    return res.view();
  },//end action

  //this is session component, it will handle what component should use
  TalkSession: function(req,res){
    var err_msg = "Error: no value call to this api or something went wrong";
    
    //message in textarea from view (GET)
    if(req.method = 'GET') {
      var msg = req.param('msg');
    }

    //debug check message from view
    console.log("Debug data from view: "+msg);

    function setCallback(){

    }

    function callStopsentence() {

      var options = {
        url: 'http://localhost:1337/Chat/StopSentence?msg='+msg,
        method: 'GET',
        json: true
      };

      //Call subsentence API
      request(options, function (err, response, body) {

        if (!err && response.statusCode == 200) {
          setCallback();
          api_res(body.answer);

        }
        else {//HTTP Error
          console.log("HTTP Error" + response.statusCode);
        }

      });//end request
    }//end function CallStopSentence


    //this function is for check input from user(question),
    //which are input are match with component or not match nether.
    Log.find({ where: { question: msg } }).exec(function find(err, found){

        setCallback();
        //match stopsentence component case
        if(!err){
          callStopsentence();
        }
        else{
          api_res(err_msg);
        }

    });//end find model

    function api_res(api_res) {
      return res.json({
        answer: api_res
      });
    }

  },//end action

  //this is component for stop sentence
  StopSentence: function (req,res) {

    var answer;
    var err_msg = "Error: no value call to this api or something went wrong";

    var msg = req.param('msg');
    if(msg != "undefined") {
      console.log("debug stopsentence get: "+msg);
    }

    //callback function for put data from mySQL to array
    function callbackData(found,i){

    }//end callback function

    //find data from mySQL
    Log.find({}).exec(function find(err, chat_log){

      for(var i=0;i<chat_log.length;i++){//loop by all record

        //put mySQL data record to value
        callbackData(chat_log[i],i);

        if(msg == chat_log[i].question){//match case(it should match)
          answer = chat_log[i].answer;
          break;
        }
        else if(msg==""){//Error case(Normally it should match)
          answer = err_msg;
        }
        else{//Error case(Normally it should match)
          answer = err_msg;
        }

      }

      //return all data in JSON
      return res.json({
        chat_log: chat_log,
        answer: answer
      });

    });//end find function

  },//end action

  RegularMatcher: function(){

  },

  MultiWord: function (req,res){
    return res.json();
  }
};

