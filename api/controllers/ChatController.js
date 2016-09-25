/**
 *
 * @description :: Server-side logic for managing Texts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 * ChatController.js
 * Back-end
 * calculate chat algorithms. except chat box's action, every action
 * create in api.
 * Normally client will send request with GET input to TalkSession,
 * And TalkSession will pick suit calculate api.
 */

var request = require('request');

module.exports = {

  Debug: function (req,res) {

    log.find({ where: { question: msg } }).exec(function find(err, found){


    });//end find model
  },

  //show view of chat box(for test chat or debug)
	ChatBox: function(req,res){

    return res.view();
  },

  //this is session component, it will handle what component should use
  TalkSession: function(req,res){

    var err_msg = "Don't Understand";

    //define name of component in DB
    var stop_sentence = "stop_sentence";
    var feedback = "feedback";

    var component;

    //message in textarea from view (GET)
    if(req.method = 'GET') {
      var msg = req.param('msg');
    }

    //debug check message from view
    console.log("Debug data from view: "+msg);

    function setCallback(){}

    function callComponent(component) {

      var options = {
        url: 'http://localhost:1337/Chat/'+component+'?msg='+msg,
        method: 'GET',
        json: true
      };

      //Call Subsentence API
      request(options, function (err, response, body) {

        if (!err && response.statusCode == 200) {
          setCallback();
          api_res(body.answer);

        }
        else {
          console.log("HTTP Error" + response.statusCode);
        }

      });

    }

    //this function is for check input from user(question),
    //which are input are match with component or not match nether.
    log.find({ where: { question: msg} }).exec(function find(err, found){

        setCallback();

        //if not error will get component type from DB
        if(found.length != 0) {
          component = found[0].component;
        }

        //match stopsentence component case
        if(!err && component == stop_sentence){
          callComponent("StopSentence");
        }
        else if(component == feedback){
          callComponent("Feedback");
        }
        else{
          api_res(err_msg);
        }

    });

    //end find model

    function api_res(api_res) {
      return res.json({
        answer: api_res
      });
    }

  },

  //Stopsentence Component refer from chat bot architecture model
  StopSentence: function (req,res) {

    var answer;
    var err_msg = "Error: no value call to this api or something went wrong";

    var msg = req.param('msg');
    if(msg != "undefined") {
      console.log("debug stopsentence get: "+msg);
    }

    //callback function for put data from mySQL to array
    function callbackData(found,i){}

    //find data from mySQL
    log.find({}).exec(function find(err, chat_log){

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

    });

  },//end action

  Feedback: function (req,res) {

    var answer;

    function setCallback(){}

    rate.find({ sort: 'score DESC' },function (err,result) {

      setCallback();

      answer = "From your feedback data we recommend "+result[0].spot_name;

      return res.json({
        answer: answer
      })

    });
  },

  RegularMatcher: function(req,res){

  }

};
