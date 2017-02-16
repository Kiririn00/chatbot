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

var request = require('request'),
  Promise = require('promise');

promise = Promise.resolve();

/*
 * feature: make JSON from parameter's string
 * parameter: string -> string that will show in json return
 * return: JSON -> parameter's string
 * */
function api_res(res,api_res) {
  return res.json({
    answer: api_res
  });
}//end function

function onRejected(err) {
  console.log(err);
}

module.exports = {

  Debug: function (req,res) {

  },

  /*
  * feature: use for get component data
  * */
  GetComponent: function (req, res) {

    if(req.method == "GET") {

      var auto_http = require('auto_http');

      auto_http.start(req);

      var log_query = {select: ['component_name']};

      function taskA() {
        component.find(log_query).exec(function (err, record) {
          console.log("return record", record);
          return res.json({component: record});
        })
      }

      promise
        .then(taskA)
        .catch(onRejected);

    }
    else{api_res(res, "no get data")}

  },//end action

  /*
  * feature: add new record to log table
  * */
  AddLog: function (req,res) {

    var auto_http = require('auto_http');

    auto_http.start(req);

    if(req.method == 'POST'){

      var question = req.param('question'),
        answer = req.param('answer'),
        component_name = req.param('component'),
        component_query = {select:['component_id'], component_name: component_name},
        component_id;

      function findComponentId() {
        component.find(component_query).exec(function (err, record) {

          var log_new_record = [{
            question: question,
            answer: answer,
            component_id: record[0].component_id

          }];

          log.create(log_new_record).exec(function () {
            console.log("new record added");
          });

        });
      }

      promise
        .then(findComponentId)
        .catch(onRejected);

      api_res(res,"POST case");

    }
    else{ api_res(res,"this API response only POST data"); }

  },

  /*
  * feature: show view of chat box(for test chat or debug)
  * */
	ChatBox: function(req,res){

	  res.locals.layout = 'chat_layout';

    return res.view();
  },

  /*
  * feature: this is session component, it will handle what component should use
  * logic:
  *   1.) compare between question from view and from db that math or not
  *     1.1) if not return no component that match.
  *   2.) In match case, make a conversation sentences
  *     2.1) method that use for make conversation will depend on type of question
  * */
  TalkSession: function(req,res){

    var err_msg = "Don't Understand",
      stop_sentence = "stop_sentence",
      feedback = "feedback",
      component_name,
      msg = req.param('msg'),
      feedback_switch = req.param('feedback_switch'),
      log_query = {select:['component_id', 'question', 'answer'], where: {question: msg}},
      done_conversation = "done recommendation";

    if(msg == null){
      return api_res(res, "no msg")
    }

    function labelRecommend(){



    }//end function

    /*
    * feature: make conversation for recommend spot of chat-bot
    * parameter: array -> set of answer
    * return: string -> conversations
    * */
    function recommendSpot(log) {

      //if user say done will destroy all of session
      if(log.question == done_conversation){
        req.session.destroy();
        return res.json({answer: "got it"});
      }

      if(req.session.counter == "NaN"){req.session.counter = 1;}
      else{
        req.session.counter++;
      }



      return res.json({answer:"count: "+req.session.counter});

    }

    function matchingComponent() {

      //this function is for check input from user(question),
      //which are input are match with component or not match nether.
      log.find(log_query).exec(function find(err, log) {

        console.log(log);

        if(log.length == 0){return api_res(res, err_msg);}

        var component_query = {select:['component_name', 'component_id'], where:{component_id: log[0].component_id}};

        component.find(component_query).exec(function (err, record) {

          if(record[0].component_id == 1){
            return res.json({answer:log[0].answer})
          }
          else if(record[0].component_id == 2){
            recommendSpot(log[0]);
          }
          else{
            return api_res(res, err_msg);
          }

        });//end component find

      });//end log find

    }//end function

    //debug check message from view
    console.log("Debug data from view: "+msg);
    console.log("Debug check status of feedback: "+feedback_switch);

    promise
      .then(matchingComponent)
      .catch(onRejected)

  }//end action

};

