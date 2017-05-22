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
  async = require('async'),
  unique = require('array-unique');

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

    function taskA(arg1,arg2,callback) {
      log.find().limit(3).exec(function (err, record) {

        console.log(arg1, arg2);
        callback(null, 3);
      });
    }
    function taskB(arg1, callback) {

      console.log(arg1);
      /*
      console.log(arg1);
      // arg1 now equals 'one' and arg2 now equals 'two'
      callback(null, 'done');
      */
    }

    async.waterfall([
      async.apply(taskA,1,2),
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

    var socket_id = sails.sockets.getId(req.socket);

    sails.sockets.join(req, socket_id, function () {

      var err_msg = "Don't Understand",
        stop_sentence = "stop_sentence",
        component_name,
        msg = req.param('msg'),
        feedback_switch = req.param('feedback_switch'),
        feedback_switch_active = 1,
        user_id = req.param('user_id'),
        log_query = {select: ['component_id', 'question', 'answer'], where: {question: msg}},
        done_conversation = "done recommendation",
        start_conversation = 2,
        end_conversation = 3,
        yes_conversation = 4,
        no_conversation = 5,
        like_conversation = 6,
        dislike_conversation = 7,
        short_state = 1,
        middle_state = 3,
        end_recommend_component = 3,
        async_on = 1,
        async_off = 0,
        //query the 
        top_label_feedback_query = "SELECT label.label_id, label_name, label_score FROM label \n"+
          "WHERE label_id IN (SELECT label_id FROM bot_log WHERE feedback_id = 1) \n"+
          "ORDER BY label.label_score DESC \n"+
          "LIMIT 10",
        top_label_default_query = "SELECT label.label_id, label_name, label_score FROM label \n"+
          "WHERE label_id NOT IN (SELECT label_id FROM bot_log) \n"+
          "ORDER BY label.label_score DESC \n"+
          "LIMIT 10";

      if (msg == null) {
        return api_res(res, "no msg")
      }
      else if (!req.isSocket) {
        return api_res(res, "no socket ")
      }

      /*
       * feature: spot recommendation system
       * parameter:
       *   1.) array ->  user's input conversation detail
       * */
      function labelRecommend(label_score, current_conversation) {

        var similarity = require('compute-cosine-similarity'),
          sortBy = require('sort-array');

        //this is [a,b]
        var query = "SELECT article.label_id, article.spot_id \n"+
              "FROM feedback \n"+
              "INNER JOIN article \n"+
              "ON feedback.label_id = article.label_id \n"+
              "GROUP BY feedback.label_id, article.spot_id ";

        var spot_label_matrix = [],
          spot_label_matrix_counter = 0,
          top_label_query = {select: ['label_id', 'label_name']},
          top_label_query_limit = 20,
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

            for (var i = 0; i < spot_number; i++) {

              console.log(user_label_score, db_spot_label_frequency[i].matrix);

              cosine[i] = similarity(user_label_score, db_spot_label_frequency[i].matrix);
              cosine_degree[i] = {
                spot_id: db_spot_label_frequency[i].spot_id,
                cosine_degree: Math.acos(cosine[i]) * (180 / Math.PI)
              };

            }

            return cosine_degree;

          }//end function

          result = similarCosineCase();

          result.sort(function (a, b) {

            if (a.cosine_degree < b.cosine_degree) {
              return -1;
            }
            if (a.cosine_degree > b.cosine_degree) {
              return 1;
            }
            else {
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

          var spot_query = {select: ['spot_name'], spot_id: spot_id},
            label_query = {select: ['label_name'], label_id: label_id},
            debug_result = [];

          spot.find(spot_query, function (err, spot) {
            label.find(label_query, function (err2, label) {

              if (err2) {
                console.log(err2);
              }

              if (err) {
                console.log(err);
              }
              else {

                debug_result.push({
                  spot_name: spot[0].spot_name,
                  match_label: label[0].label_name,
                  match_label_frequency: frequency
                });

                sails.log("debug: ", debug_result);
              }

            });
          });

        }//end function

        /*
         * feature: generate the array and add the integer to array
         * parameter:
         *   1.) integer -> spot id
         *   2.) integer -> label_id in the spot id
         *   3.) integer -> frequency
         *   4.) array -> top label's list
         * */
        function addMatrix(spot_id, label_id, frequency, top_label) {

          var label_index = 0,
            frequency_matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

          //find label's index
          for (var i = 0; i < 10; i++) {

            if (top_label[i] == label_id) {

              label_index = top_label.indexOf(label_id);

              //increase matrix
              frequency_matrix[label_index] = frequency;

              //if you want to check the all data of the location uncomment this
              //debugResult(top_label[i], spot_id, frequency);

            }

          }//end loop

          //add new data to array
          spot_label_matrix.push({spot_id: spot_id, matrix: frequency_matrix});

          //update counter
          spot_label_matrix_counter++;

        }//end function

        /*
        * feature: find the label's name because feedback table don't have label_name 's row
        * */
        function feedbackLabel(callback) {
          var feedback_label_query = "SELECT DISTINCT feedback.label_id, label.label_name \n"+
                                  "FROM feedback \n"+
                                  "JOIN label \n"+
                                  "ON feedback.label_id = label.label_id";

          label.query(feedback_label_query, function (err, records) {
            console.log("feedbackLabel's record: ", records[0].label_id);
            callback(null, records);
          })
        }

        /*
        *
        * feature: generate the top label FROM the label
        *         in the feedback table and default label from label table
        * */
        function findTopLabel(feedback_label, callback) {

          //find top label from label table
          label.find(top_label_query).sort(top_label_query_sort).limit(top_label_query_limit).exec(function (err, top_label_records) {

            var top_label = [],
              algorithm_result,
              default_counter = 0,
              top_label_length = 10;

            for (var i = 0; i < top_label_length; i++) {

              if (feedback_label[i] != null) {
                top_label[i] = feedback_label[i].label_id;

                console.log("label from feedback", top_label[i]);
              }
              else {
                top_label[i] = top_label_records[i].label_id;
                default_counter++;
                console.log("label from default", top_label[i]);
              }
            }

            top_label = unique(top_label);

            for(j=0; j<11 - top_label.length;j++){
              top_label.push(top_label_records[default_counter].label_id);
              default_counter++;
            }

            console.log("top label: ", top_label);

            callback(null, top_label);

          });//end label find
        }

        /*
        *
        * feature: find the spot that match to the top label
        * */
        function findArticle(top_label, callback) {

            var article_query = {
              select: ['spot_id', 'label_id']
            },
              counter = 0,
              spot_id = [],
              label_id = [],
              j =0;

            article.find(article_query).exec(function (err, article_records) {

              for(var i=0; i<article_records.length;i++){

                //console.log("compare article record: ", article_records[i].label_id);

                for(j=0; j<top_label.length; j++) {

                  if (article_records[i].label_id == top_label[j]) {

                    spot_id[counter] = article_records[i].spot_id;
                    label_id[counter] = article_records[i].label_id;
                    counter++;
                    console.log("match spot&label", spot_id, label_id);

                  }
                }
              }
              //send the spo id and label id in the spot id
              callback(null, spot_id, label_id, top_label);
            });
          }//end function


          function makeMatrix(spot_id, label_id, top_label ,callback) {

            for (var i = 0; i < spot_id.length; i++) {
              addMatrix(spot_id[i], label_id[i], 1, top_label);
            }

            algorithm_result = algorithmCalculate(label_score, spot_label_matrix);

            //console.log("algorithm_result: " + algorithm_result[0].spot_id);

            spot.find({
              select: ['spot_name'],
              where: {spot_id: algorithm_result[0].spot_id}
            }).exec(function (err, spot_db) {

              //make decision for question or recommend
              conversationDecision(algorithm_result[0].cosine_degree, spot_db[0].spot_name, algorithm_result[0].spot_id, current_conversation);

            });
          }

        async.waterfall([
          feedbackLabel,
          findTopLabel,
          findArticle,
          makeMatrix
        ], function (err, result) {

        });

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
          label_score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          positive_answer = 1,
          negative_answer = -1;

        for (var i = 0; i < conversation_step; i++) {

          if (current_conversation[i].component_id >= 4) {

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

        console.log("user's label: ", label_score);
        return label_score;

      }//end fnc

      /*
       * feature: count number of question(yes,no) form parameter
       * */
      function countQuestion(current_conversation, conversation_step) {
        var question_num = 0;

        for (var i = 0; i < conversation_step; i++) {
          if (current_conversation[i].component_id >= 4) {
            question_num++;
          }
        }
        return question_num;
      }//end func


      /*
       * feature: bot will ask label's question to user. this function will active
       *        in case that bot decide to asking the question to user(not to answer or recommend).
       * */
      function botAskQuestion(current_conversation, conversation_step) {

        var top_label_query = "SELECT label.label_id, label_name, label_score FROM label \n" +
            "WHERE label_id NOT IN (SELECT label_id FROM bot_log) \n" +
            "ORDER BY label.label_score DESC \n" +
            "LIMIT 10",
          question_num = countQuestion(current_conversation, conversation_step);

        /*
         * feature: record the bot's action (recommend,ask label, etc)
         * parameter:
         *  integer ->the label id. This label is come from the currently label
         *         bot is asking to the user.
         *  string -> the label name for send to the returnQuestion function.
         *  integer -> the user id (currently using the system)
         *
         * */
        function botLogRecord(label_id, label_name, callback) {

          var bot_log_query = [{
            label_id: label_id,
            user_id: user_id,
            state_id: middle_state,
            label_score: 101
          }];

          bot_log.create(bot_log_query).exec(function (err, records) {
            console.log("make new bot's log: ", records);
          });

          callback(null, label_name);

        }

        /*
        *
        * feature: find top label from DB
        * */
        function chooseLabel(callback) {

          label.query(top_label_query, function (err, records) {

            if (err) {
              console.log(err)
            }
            //for first time that bot ask user.There no need to make user vector
            if (conversation_step == 2) {

              callback(null, records[0].label_id, records[0].label_name);

            }
            else {

              makeUserMatrix(current_conversation, conversation_step);

              callback(null, records[question_num].label_id, records[question_num].label_name);

            }

          });

        }//end func

        async.waterfall([
          chooseLabel,
          botLogRecord
        ], function (err, label_name) {

          return res.json({
            answer: "Do you interested in " + label_name + "?"
          });
        });//end async

      }//end func

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
      function conversationDecision(cosine_degree, spot_name, spot_id, current_conversation, top_label_records) {

        //note: we should make some algorithm for decide threshold
        var state_threshold = 55,
          component_id = current_conversation[current_conversation.length - 1].component_id;


        function lastBotLogRecord(callback) {
          var bot_log_query = {
            select :['label_id'],
            sort: 'bot_log_id DESC',
            limit: 10
          };

          bot_log.find(bot_log_query).exec(function (err, record) {
            if(err){console.log(err);}
            else {
              callback(null, record[0].label_id);
            }
          });
        }

        /*
         * feature: reference the type of feedback and generate conversation from ref.
         * parameter:
         *   integer -> log id
         *   integer -> feedback type <6:like>, <7:dislike> 6 and 7 are reference
         *              from the value of like_conversation and dislike_conversation.
         * */
        function recordFeedback(label_id, callback) {

          var feedback_query_insert = [{
            label_id: label_id
          }];

          if(component_id == 2) {// if user answer in "yes" in start

            feedback.create(feedback_query_insert).exec(function (err, record) {
              console.log("record the feedback: ", record);
            });

          }
          else if(component_id == 4) {// if user answer in "yes"

            feedback.create(feedback_query_insert).exec(function (err, record) {
              console.log("record the feedback: ", record);
            });

          }

          callback(null, "done");

        }

        function thresholdDecision(done, callback) {

          if (cosine_degree >= state_threshold) {//answer question
            //userFeedback(current_conversation, current_conversation.length, spot_id);

            makeLog(end_conversation, end_recommend_component, async_off);

            return res.json({
              answer: "Then I recommend: " + spot_name,
              feedback_question: "Like or Dislike?"
            });
          }
          //note: even length and threshold is ==, It return false. Bug?
          else if (cosine_degree < state_threshold) {//ask question
            botAskQuestion(current_conversation, current_conversation.length, top_label_records);
          }
          else {
            return res.json({
              answer: "Error: Yes or No case"
            });
          }
        }

        async.waterfall([
          lastBotLogRecord,
          recordFeedback,
          thresholdDecision
        ],function (err, result) {

        })

      }//end fnc



      /*
       * feature: make conversation for recommend spot of chat-bot
       * parameter:
       *   1.) array -> set of answer
       *   2.) integer -> log id
       * return: string -> conversations
       * */
      function makeConversation(conversation, log_id) {

        //console.log("input parameter: ", conversation);

        var log_query = {
            select: [
              'log_id',
              'component_id',
              'user_id',
              'message'
            ],
            where: {
              or: [
                {component_id: start_conversation},
                {component_id: end_conversation},
                {component_id: yes_conversation},
                {component_id: no_conversation}
              ],
              user_id: user_id
            }
          },
          index_end_conversation,
          user_label_score,
          current_conversation = [],
          current_conversation_counter = 0,
          introduce_con = "Ok, I will ask many of question.  And you should answer something like yes or no." +
            "If you want to stop recommend please type “end",
          end_con = "OK, your main window will redirect to A square valley content’s page. If you have some" +
            "question call me by type something. Enjoy";

        log.find(log_query).sort('log_id ASC').exec(function (err, record) {

          //find end component
          for (var i = record.length; i >= 0; i--) {

            if (record[i - 1].component_id == end_conversation) {

              //console.log("log id of end component: ", record[i-1].log_id);
              index_end_conversation = i - 1;
              break;

            }

          }//end loop

          //find after last end component
          for (var l = index_end_conversation; l < record.length; l++) {

            current_conversation[current_conversation_counter] = record[l];
            current_conversation_counter++;

          }

          console.log("current conversation: ", current_conversation);
          console.log("component id: ", conversation.component_id);

          //conversation's answer decide
          if (current_conversation.length == 2 && conversation.component_id == 2) {//when start
            botAskQuestion(current_conversation, conversation.component_id);
          }
          else if (current_conversation.length == 1 && conversation.component_id == 3) {//when end
            return res.json({
              answer: "recommend end case",
              component_id: conversation.component_id
            });
          }
          else if (current_conversation.length > 2 && conversation.component_id > 3 < 6) {//yes or no case

            user_label_score = makeUserMatrix(current_conversation, current_conversation.length);
            labelRecommend(user_label_score, current_conversation);
            //conversationDecision(current_conversation);

          }
          else if (conversation.component_id >= 6 && feedback_switch == feedback_switch_active) {//like or dis like case

            return res.json({
              answer: "thank you for your feedback",
              component_id: conversation.component_id
            })

          }
          else {//error case

            return res.json({
              answer: "recommend error case",
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
       *   3.) integer -> 0 is not use async 1 is use async
       * */
      function makeLog(state_id, conversation_id, async_status, callback) {

        //console.log("logs are made");

        var log_query = [{
          component_id: conversation_id,
          user_id: user_id,
          state_id: state_id,
          message: msg
        }];

        log.create(log_query).exec(function (err, record) {

          if (async_status == async_on) {
            callback(null, record);
          }
          else if (async_status == async_off) {
            console.log("add log: ", record);
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

        var conversation_query = {select: ['component_id', 'question', 'answer'], where: {question: msg}};

        console.log('work on room: ' + socket_id + '!');

        conversation.find(conversation_query).exec(function find(err, conversation) {

          //make log or return error
          if (conversation.length == 0) {
            return api_res(res, err_msg);
          }

          function selectComponent(log_record) {

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
                makeConversation(conversation[0], log_record[0].log_id);//send the current conversation.
              }
              else {//no match case
                makeLog(end_conversation, conversation[0].component_id, async_off);
                return api_res(res, err_msg);
              }

            });//end component find

          }//end component find

          //make sync log must make before component selected
          async.waterfall([
            async.apply(makeLog, short_state, conversation[0].component_id, async_on),
            selectComponent
          ], function (err, result) {

          });

        });//end conversation find


      }//end function

      //debug check message from view
      //console.log("Debug data from view: "+msg);
      //console.log("Debug check status of feedback: "+feedback_switch);

      promise
        .then(matchingComponent)
        .catch(onRejected)

    });//end socket
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

