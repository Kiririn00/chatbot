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
  Promise = require('promise'),
  async = require('async');

promise = Promise.resolve();

/*
 * feature: make JSON from parameter's string
 * parameter: string -> string that will show in json return
 * return: JSON -> parameter's string
 * */
function api_res(res,api_res) {
  return res.json({
    answer: api_res,
    component_id: 0
  });
}//end function

function onRejected(err) {
  console.log("promise catch",err);
}

/*
 * feature: sort object array
 * parameter:
 *   1.) array -> array that want to sort
 *   2.) string -> name of key of object array that want to sort.
 * return: array
 *   1.) sorted's array
 * */
function sortObjectArray(object_array, sort_key) {

  object_array.sort(function (a,b) {

    if(a[sort_key] < b[sort_key]){ return -1; }
    if(a[sort_key] > b[sort_key]){ return 1; }
    else{ return 0;}

  });

  return object_array;

}

module.exports = {

  Debug: function (req,res) {

    function taskA(callback) {
      log.find().limit(3).exec(function (err, record) {
        callback(null, record);
      });
    }
    function taskB(arg1, callback) {
      console.log("taskB");
      console.log(arg1);
      // arg1 now equals 'one' and arg2 now equals 'two'
      callback(null, 'done');
    }

    async.waterfall([
      taskA,
      taskB
    ], function (err, result) {
      // result now equals 'done'
    });

    return res.json({debug:"Debug"});

  },

  /*
  * feature: use for get component data
  * */
  GetComponent: function (req, res) {

    if(req.method == "GET") {

      var log_query = {select: ['component_name']};

      function taskA() {
        component.find(log_query).exec(function (err, record) {
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

          conversation.create(log_new_record).exec(function () {
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

	  if(req.method == "GET") {

      var user_id = req.param('user_id');

      if(typeof user_id == "undefined"){return res.view('user/Login');}
      else {
        return res.view({
          user_id:user_id
        });
      }

    }

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
      user_id = req.param('user_id'),
      log_query = {select:['component_id', 'question', 'answer'], where: {question: msg}},
      done_conversation = "done recommendation",
      socket_id = sails.sockets.getId(req.socket),
      start_conversation = 2,
      end_conversation = 3,
      yes_conversation = 4,
      no_conversation = 5,
      short_conversation = 1,
      end_recommend_component = 3;

    console.log("feedback status: ", feedback_switch);

    if(msg == null){
      return api_res(res, "no msg")
    }
    else if(!req.isSocket) {
      return api_res(res, "no socket ")
    }

    /*
    * feature: spot recommendation system
    * parameter:
    *   1.) array ->  user's input conversation detail
    * */
    function labelRecommend(label_score, current_conversation){

      var similarity = require( 'compute-cosine-similarity' ),
        sortBy = require('sort-array');

      //this is [a,b]
      var query = "SELECT DISTINCT article.label_id, article.spot_id, label.label_score, COUNT(*) AS 'Num' \n" +
          "FROM (SELECT * FROM label ORDER BY label.label_score DESC LIMIT 10) label \n" +
          "INNER JOIN article \n" +
          "ON label.label_id = article.label_id \n" +
          "GROUP BY label.label_id, article.spot_id \n" +
          "ORDER BY label.label_score DESC\n";

      var spot_label_matrix = [],
        spot_label_matrix_counter = 0,
        top_label_query = {select:['label_id', 'label_name']},
        top_label_query_limit = 10,
        top_label_query_sort = "label_score DESC",
        top_label_name = [];


      /*
       * feature: calculate between personal data and DB's data
       * parameter:
       *   1.) array -> user's label score(personal's data)
       *   2.) array -> db's label frequency(all user's data)
       * return: array -> cosine
       * */
      function algorithmCalculate(user_label_score, db_spot_label_frequency) {

        var spot_weight = [],
          spot_number = db_spot_label_frequency.length,
          result;

        function similarCosineCase() {

          var cosine = [],
            cosine_degree = [];

          for(var i=0; i<spot_number;i++){

            console.log(user_label_score, db_spot_label_frequency[i].matrix);

            cosine[i] = similarity(user_label_score, db_spot_label_frequency[i].matrix);
            cosine_degree[i] = {spot_id: db_spot_label_frequency[i].spot_id ,cosine_degree:Math.acos(cosine[i]) * (180/Math.PI)};

          }

          return cosine_degree;

        }//end function

        result = similarCosineCase();

        result.sort(function (a,b) {

          if (a.cosine_degree < b.cosine_degree ) {
            return -1;
          }
          if (a.cosine_degree > b.cosine_degree) {
            return 1;
          }
          else{
            return 0;
          }
          // a must be eq

        });

        console.log(result);

        return result;

      }

      /*
       * feature: use for show name of any id and what it calculate
       * parameter:
       *   1.) integer -> label_id,
       *   2.) integer -> spot_id,
       *   3.) integer -> label x spot frequency
       * */
      function debugResult(label_id, spot_id, frequency) {

        var spot_query = {select:['spot_name'], spot_id: spot_id},
          label_query = {select:['label_name'], label_id: label_id},
          debug_result = [];

        spot.find(spot_query, function (err, spot) {
          label.find(label_query, function (err2, label) {

            if(err2){console.log(err2);}

            if(err){console.log(err);}
            else{

              debug_result.push({
                spot_name: spot[0].spot_name,
                match_label:label[0].label_name,
                match_label_frequency: frequency
              });

              sails.log("debug: ",debug_result);
            }

          });
        });

      }//end function

      /*
       * feature: add matrix to return array
       * parameter:
       *   1.) integer -> spot id
       *   2.) integer -> label_id
       *   3.) integer -> frequency
       *   4.) array -> top label's list
       * */
      function addMatrix(spot_id, label_id ,frequency, top_label) {

        var label_index = 0,
          frequency_matrix = [0,0,0,0,0,0,0,0,0,0];

        //find label's index
        for(var i=0; i<10; i++){

          if (top_label[i] == label_id) {

            label_index = top_label.indexOf(label_id);

            //increase matrix
            frequency_matrix[label_index] = frequency;

            //if you want to check the all data of the location uncomment this
            //debugResult(top_label[i], spot_id, frequency);

          }

        }//end loop

        //add new data to array
        spot_label_matrix.push({spot_id: spot_id, matrix: frequency_matrix });

        //update counter
        spot_label_matrix_counter++;

      }//end function

      //find top label
      label.find(top_label_query).sort(top_label_query_sort).limit(top_label_query_limit).exec(function (err, records) {

        var top_label = [],
          algorithm_result;

        for(var i = 0; i<records.length;i++) {
          top_label[i] = records[i].label_id;
          top_label_name[i] = records[i].label_name;
        }

        console.log(top_label);

        if(err){console.log(err);}
        else{}

        //make matrix
        label.query(query, function (err, records) {

          if (err) {
            console.log(err)
          }
          else {

            for (var i = 0; i < records.length; i++) {
              addMatrix(records[i].spot_id, records[i].label_id, records[i].Num, top_label);
            }

            algorithm_result = algorithmCalculate(label_score, spot_label_matrix);

            console.log("algorithm_result: "+ algorithm_result[0].spot_id);

            spot.find({select: ['spot_name'], where: {spot_id: algorithm_result[0].spot_id}}).exec(function (err, spot_db) {

              conversationDecision(algorithm_result[0].cosine_degree, spot_db[0].spot_name, algorithm_result[0].spot_id , current_conversation);

            });

          }//end else

        });//end label query

      });//end label find

    }//end label recommend function

    /*
     * feature: reference log for make user's matrix by add integer to array
     * parameter:
     *   1.) array -> presently set of the conversation.
     *   2.) integer -> length of current conversation
     * res return:
     *   array -> bot answer
     * */
    function makeUserMatrix(current_conversation, conversation_step) {

      var label_score_counter = 0,
        label_score = [0,0,0,0,0,0,0,0,0,0],
        positive_answer = 1,
        negative_answer = -1;

      for(var i=0; i< conversation_step; i++){

        if(current_conversation[i].component_id >= 4) {

          if (current_conversation[i].component_id == 4) {//yes
            label_score[label_score_counter] = positive_answer;
            label_score_counter++;
          }
          else if (current_conversation[i].component_id == 5) {//no
            label_score[label_score_counter] = negative_answer;
            label_score_counter++;
          }

        }//end if

      }//end loop

      console.log("user's label: ",label_score);
      return label_score;

    }//end fnc

    /*
    * feature: count number of question(yes,no) form parameter
    * */
    function countQuestion(current_conversation, conversation_step) {
      var question_num = 0;

      for(var i =0; i<conversation_step; i++){
        if(current_conversation[i].component_id >= 4){
          question_num++;
        }
      }
      return question_num;
    }//end func

    /*
     * feature: bot will ask label's question to user.
     * */
    function botAskQuestion(current_conversation , conversation_step) {

      var top_label_query = {select:['label_id', 'label_name']},
        top_label_query_limit = 10,
        top_label_query_sort = "label_score DESC",
        question_num = countQuestion(current_conversation, conversation_step);

      label.find(top_label_query).sort(top_label_query_sort).limit(top_label_query_limit).exec(function (err, records) {

        if(err){console.log(err)}
        //for first time that bot ask user.There no need to make user vector
        if(conversation_step == 2){
          return res.json({
            answer: "Do you interested in "+records[0].label_name+"?"
          });
        }
        else {
          makeUserMatrix(current_conversation, conversation_step);
          return res.json({
            answer: "Do you interested in "+records[question_num].label_name+"?"
          });
        }

      });//end async model find

    }//end func

    /*
    * feature: save user's feedback
    * */
    function userFeedback(current_conversation , conversation_step, spot_id) {

      var feedback_query = {where: {spot_id: spot_id}},
        user_matrix;

      user_matrix = makeUserMatrix(current_conversation, conversation_step);

      feedback.find(feedback_query);

    }


    /*
     * feature: make answer or question from user
     * parameter:
     *  1.) integer -> cosine degree from spot weight calculate func
     *  2.) string ->
     * call func:
     *  1.) botAnswerQuestion
     * res return
     *   array:
     *     1.) string -> error text
     *     2.) integer -> user's input component
     * logic:
     *  1.) set threshold of question and answer
     *  2.) before threshold, bot will make question
     *  3.) after overcome threshold, bot will make answer
     * */
    function conversationDecision(cosine_degree, spot_name, spot_id ,current_conversation) {

      //note: we should make some algorithm for decide threshold
      var state_threshold = 55;

      if(cosine_degree >= state_threshold){//answer question
        //userFeedback(current_conversation, current_conversation.length, spot_id);
        makeLog(end_conversation, end_recommend_component);
        return res.json({
          answer: "Then I recommend: "+spot_name,
          feedback_question: "Like or Dislike?"
        });
      }
      //note: even length and threshold is ==, It return false. Bug?
      else if(cosine_degree < state_threshold) {//ask question
        botAskQuestion(current_conversation, current_conversation.length);
      }
      else {
        return res.json({
          answer:"Error: Yes or No case"
        });
      }

    }//end fnc

    /*
    * feature: make conversation for recommend spot of chat-bot
    * parameter: array -> set of answer
    * return: string -> conversations
    * */
    function makeConversation(conversation) {
      //console.log("input parameter: ", conversation);

      var log_query = {
          select:[
            'log_id',
            'component_id',
            'message'],
          where:{
            or :[
              {component_id:start_conversation},
              {component_id:end_conversation},
              {component_id:yes_conversation},
              {component_id:no_conversation}
            ]
          }
        },
        index_end_conversation,
        user_label_score,
        current_conversation = [],
        current_conversation_counter = 0,
        introduce_con = "Ok, I will ask many of question.  And you should answer something like yes or no."+
          "If you want to stop recommend please type “end",
        end_con = "OK, your main window will redirect to A square valley content’s page. If you have some"+
          "question call me by type something. Enjoy";

      log.find(log_query).sort('log_id ASC').exec(function (err, record) {


        //find end component
        for (var i = record.length; i >= 0; i--) {

          if (record[i-1].component_id == end_conversation) {

            //console.log("log id of end component: ", record[i-1].log_id);
            index_end_conversation = i-1;
            break;

          }

        }//end loop

        //find after last end component
        for (var l = index_end_conversation; l < record.length; l++) {
          current_conversation[current_conversation_counter] = record[l];
          current_conversation_counter++;
        }

        console.log(current_conversation);

        //conversation's answer decide
        if(current_conversation.length == 2 && conversation.component_id == 2){//when start

          botAskQuestion(current_conversation, conversation.component_id);

        }
        else if(current_conversation.length == 1  && conversation.component_id == 3){//when end

          return res.json({
            answer:"recommend end case",
            component_id: conversation.component_id
          });

        }
        else if(current_conversation.length > 2 && conversation.component_id > 3){//yes or no case

          user_label_score = makeUserMatrix(current_conversation, current_conversation.length);
          labelRecommend(user_label_score, current_conversation);
          //conversationDecision(current_conversation);

        }
        else{//error case

          return res.json({
            answer:"recommend error case",
            component_id: conversation.component_id
          });
        }

      });//end find

    }//end func


    /*
    * feature: make log of conversation
    * parameter
    *   1.) integer -> the state of conversation.
    *                 This is the process of the conversation.
    *                 There has start,yes,no,end,etc.
    *   2.) integer -> conversation state.
    * */
    function makeLog(state_id, conversation_id, callback) {

      //console.log("logs are made");

        var log_query = [{
          component_id: conversation_id,
          user_id: user_id,
          state_id: state_id,
          message: msg
        }];

        log.create(log_query).exec(function (err, record) {
          if(err){console.log(err);}
          else{
            console.log("", record);
            if(callback == null){

            }
            else {
              callback(null, record);
            }
          }
        });

    }//end fnc

    /*
    * feature: check input from view that what is component of that sentence or conversation
    * logic:
    *   1.) join socket room of client
    *   2.) make log of user's input
    *     2.1) save log to DB
    *   3.) check user 's input component from DB
    *   4.) use function that suit from component
    * return: JSON -> suited sentence
    * */
    function matchingComponent() {

      sails.sockets.join(req, socket_id, function () {

       var conversation_query = {select:['component_id', 'question', 'answer'], where: {question: msg}};

        console.log('work on room: ' + socket_id + '!');

        conversation.find(conversation_query).exec(function find(err, conversation) {

          //make log or return error
          if(conversation.length == 0){return api_res(res, err_msg);}

          function selectComponent(arg1, callback) {

            var component_query = {
              select: ['component_name', 'component_id'],
              where: {component_id: conversation[0].component_id}
            };

            component.find(component_query).exec(function (err, record) {

              if (record[0].component_id == 1) {//stopsentence case
                return res.json({
                  answer: conversation[0].answer,
                  component_id: 1
                });
              }
              else if (record[0].component_id >= 2) {//recommend case
                makeConversation(conversation[0]);
              }
              else {//no match case
                makeLog(end_conversation, conversation[0].component_id);
                return api_res(res, err_msg);
              }

            });//end component find

          }//end component find

          //make sync log must make before component selected
          async.waterfall([
            async.apply(makeLog, short_conversation, conversation[0].component_id),
            selectComponent
          ], function (err, result) {

          });

        });//end conversation find

      });//end join room

    }//end function

    //debug check message from view
    //console.log("Debug data from view: "+msg);
    //console.log("Debug check status of feedback: "+feedback_switch);

    promise
      .then(matchingComponent)
      .catch(onRejected)

  },//end action

  /*
  * feature: find recommend component(we set recommend id to 2)
  * */
  RecommendComponent: function (req, res) {

    if(req.method == "GET"){

      var log_query = {select: ['question'], where: {component_id: 2}};

      conversation.find(log_query,function (err, records) {

        return res.json({records: records});

      });

    }

  }//end action

};

