/**
 *
 * @description :: Server-side logic for managing Texts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jquery = require('jquery');
var request = require('request');


module.exports = {

  //show view of chat box(for test chat or debug)
	ChatBox: function(req,res){

    return res.view();
  },//end action

  //this is session component, it will handle what component should use
  TalkSession: function(req,res){

    var sub_sentence_question = [];

    //message in textarea from view (GET)
    if(req.method = 'GET') {
      var msg = req.param('msg');
    }

    //debug check message from view
    console.log("Debug data from view: "+msg);

    /*if match with stopsentence case will use this function.
     *This function purpose is send message(user's input)
     * to stopsentence api and get result
     */
    function callStopsentence() {

      var options = {
        url: 'http://localhost:1337/Chat/StopSentence?msg='+msg,
        method: 'GET',
        json: true
      };

      // function for callback
      function requestCallback() {}

      //Call subsentence API
      request(options, function (err, response, body) {

        if (!err && response.statusCode == 200) {
          requestCallback(body.answer);
          api_res(body.answer);

        }
        else {//HTTP Error
          console.log("HTTP Error" + response.statusCode);
        }

      });//end request
    }//end function CallStopSentence

    //still not use now
    function callRegularMatcher(){

    }

    //Callback function
    function callbackData(found,i){

    }

    /*
    this function is for check input from user(question),
    which are input are match with component or not match nether.
    */
    log.find({select:['question']}).exec(function find(err, found){

      for(var i=0;i<found.length;i++){//loop by all record
        //put mySQL data record to value
        callbackData(found[i],i);

        sub_sentence_question[i] = found[i].question;

        //console.log(sub_sentence_question[i]);//debug question log from mySQL
        console.log();

        if(msg == sub_sentence_question[i]){//StopSentence case
          console.log("debug: StopSentence case");
          callStopsentence();
          break;
        }
        else if(msg != sub_sentence_question[i]){//MultiWord case(for now)
          console.log("debug: Regular matcher case");
        }
        else{
          /*error case */
          console.log("debug: Error");
        }
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
    var err_msg =
      "Error: no value call to this api or something went wrong";

    var msg = req.param('msg');
    if(msg != "undefined") {
      console.log("debug stopsentence get: "+msg);
    }

    //callback function for put data from mySQL to array
    function callbackData(found,i){

    }//end callback function

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

      //debug all data from DB
      //console.log(chat_log);
      //console.log("Debug response data from subsentence: "+answer);

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

