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
      var feedback_switch = req.param('feedback_switch');
    }

    //debug check message from view
    console.log("Debug data from view: "+msg);
    console.log("Debug check status: "+feedback_switch);

    function setCallback(){}

    //this function will use for call component's API
    //name of component will use as parameter
    function callComponent(component) {

      var options = {
        url: 'http://localhost:1337/Chat/'+component+'?msg='+msg+'&feedback_switch='+feedback_switch,
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
        //match feedback component case
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
    var cal_feedback_switch;

    var msg = req.param('msg');
    var feedback_switch = req.param('feedback_switch');//0 or 1

    console.log("Debug feedback_switch from feedback component: "+feedback_switch);

    function setCallback(){}

    //SQL no error case
    function sql_result(result){
      console.log(result);
    }

    //this is function for decrease score of DB
    //parameter spot:name of spot, decrease: number for - score
    function decreaseScore(spot_name, decrease){

      setCallback();

      rate.query('UPDATE rate SET score = score - '+decrease+' WHERE spot_name = "'+spot_name+'"', function (err, result) {

        if (err){
          error(err);
        }
        else{
          sql_result(result);
        }

      });
    }

    function zeroScore(spot_name){

      rate.query('UPDATE rate SET score = 0 WHERE spot_name = "'+spot_name+'"', function (err, result) {

        if (err){
          error(err);
        }
        else{
          sql_result(result);
        }

      });
    }

    //main operation

    //sort score in DB
    rate.find({ sort: 'score DESC' },function (err,result) {

      setCallback();

      //not calculate score case
      if(feedback_switch == 0) {
        cal_feedback_switch = 0;
      }
      else if(feedback_switch == 1){
        cal_feedback_switch = 1;
      }

      if (msg == "No") {

        if(feedback_switch == 1){
          zeroScore(result[0].spot_name);
          decreaseScore(result[1].spot_name,2);
        }
        else if(feedback_switch == 0) {
          decreaseScore(result[0].spot_name,5);
        }

      }
      else {

        console.log("Debug return from feedback component: " + result[0].spot_name);

        answer = "From your feedback data we recommend " + result[0].spot_name;

      }

      rate.find({ sort: 'score DESC' },function (err,result) {

        setCallback();

        answer = "we recommend "+result[0].spot_name;

        return res.json({
          answer: answer
        })

      });

    });
  },
  NoFeedback: function () {
   //if feedback button not checked. will no calculate
  },
  RegularMatcher: function(req,res){

  }

};

