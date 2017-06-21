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
        end_state = 4,
        end_recommend_component = 3,
        async_on = 1,
        async_off = 0,
        top_label_feedback_query = "SELECT label.label_id, label_name, label_score FROM label \n"+
          "WHERE label_id IN (SELECT label_id FROM bot_log WHERE feedback_id = 1 & bot_log.user_id = "+user_id+") \n"+
          "ORDER BY label.label_score DESC \n"+
          "LIMIT 10",
        top_label_default_query = "SELECT label.label_id, label_name, label_score FROM label \n"+
          "WHERE label_id NOT IN (SELECT label_id FROM bot_log) \n"+
          "ORDER BY label.label_score DESC \n"+
          "LIMIT 10",
        calculate_dimension = 10;

      if (msg == null) {
        return api_res(res, "no msg")
      }
      else if (!req.isSocket) {
        return api_res(res, "no socket ")
      }

      /*
       * feature: record the bot's action (recommend,ask label, etc)
       * parameter:
       *  integer ->the label id. This label is come from the currently label
       *         bot is asking to the user.
       *  string -> the label name for send to the returnQuestion function.
       *  integer -> the user id (currently using the system)
       *
       * */
      function botLogRecord(top_label, conversation_step) {

        for (var i = 0; i < conversation_step; i++) {

          var bot_log_query = [{
            label_id: top_label.label_id[i],
            user_id: user_id,
            state_id: middle_state,
            label_score: 101
          }];

          bot_log.create(bot_log_query).exec(function (err, records) {
            console.log("make new bot's log of: ", records);
          });

        }
      }//end func

      /*
      * feature: find the spot name by input the spot id
      * parameter:
      *   integer -> spot id
      * */
      function findSpotName(spot_id, callback) {

        var spot_name_query = {
          select:'spot_name',
          where:{spot_id: spot_id}
        };

        spot.find(spot_name_query).exec(function (err, spot_name) {
          callback(null, spot_id);
        });

      }

      /*
       * feature: spot recommendation system
       * parameter:
       *   1.) array ->  user's input conversation detail
       * */
      function labelRecommend(current_conversation) {

        var similarity = require('compute-cosine-similarity'),
          sortBy = require('sort-array');

        var spot_label_matrix = [],
          spot_label_matrix_counter = 0,
          conversation_step = current_conversation.length;


        /*
         * feature: calculate between personal data and DB's data
         * parameter:
         *   1.) array -> user's label score(personal's data)
         *   2.) array -> db's label frequency(all user's data)
         * return: array -> cosine
         * */
        function algorithmCalculate(user_label_score, db_spot_label_frequency, spot_id) {

          var spot_number = db_spot_label_frequency.length,
            result;

          function similarCosineCase() {

            var cosine = [],
              cosine_degree = [];

            for (var i = 0; i < spot_number; i++) {

              console.log(db_spot_label_frequency[i].spot_id,user_label_score, db_spot_label_frequency[i].matrix);

              cosine[i] = similarity(user_label_score, db_spot_label_frequency[i].matrix);
              cosine_degree[i] = {
                spot_id: db_spot_label_frequency[i].spot_id,
                cosine_degree: Math.acos(cosine[i]) * (180 / Math.PI),
                user_vector: user_label_score,
                spot_vector: db_spot_label_frequency[i].matrix

              };

            }

            return cosine_degree;

          }//end function

          result = similarCosineCase();

          //sort for cosine degree in DESC
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

          console.log("result: ", result);

          return result;

        }//end function

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
         * feature: reference log for make user's matrix by add integer to array
         * parameter:
         *   1.) array -> presently set of the conversation.
         *   2.) integer -> length of current conversation
         * res return:
         *   array -> bot answer
         * */
        function makeUserMatrix(top_label, add_default_length ,callback) {

          var label_score_counter = 0,
            feedback_label_score_counter = 9,
            label_score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            positive_answer = 1,
            negative_answer = -1;

          //add the feedback value to label score
          for(var l=label_score.length; l > add_default_length; l-- ){
            label_score[l-1] = positive_answer;
          }

          //add the normal value(get from the conversation) into label score
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
          callback(null, top_label, add_default_length ,label_score);
                      //We will do after this. Have to make User vector by pickup the feedback label
                      //into the vector like if feedback have 5 label when start the vector
                      //should be [0,0,0,0,0,1,1,1,1,1]

        }//end fnc


        /*
        *
        * feature: find the spot that match to the top label
        * */
        function findArticle(top_label, add_default_length, label_score, callback) {

            var article_query = {
              select: ['spot_id', 'label_id']
            },
              counter = 0,
              spot_id = [],
              label_id = [],
              j =0;

            article.find(article_query).exec(function (err, article_records) {

              //console.log("article_records: ", article_records);

              for(var i=0; i<article_records.length;i++){

                //for debug
                //console.log("compare article record: ", article_records[i].label_id, top_label.label_id[i]);

                for(j=0; j<top_label.label_id.length; j++) {

                  if (article_records[i].label_id == top_label.label_id[j]) {

                    spot_id[counter] = article_records[i].spot_id;
                    label_id[counter] = article_records[i].label_id;
                    counter++;
                    console.log("match spot&label", spot_id, label_id);

                  }
                }//end loop

              }

              if(spot_id.length == 0) {

                makeLog(end_state, end_recommend_component, async_off);
                botLogRecord(top_label, current_conversation.length -2);
                return res.json({
                  answer: "Can't find spot that suit from the label_id in article table."
                });
              }
              //send the spo id and label id in the spot id
              callback(null, spot_id, label_id, top_label, add_default_length , label_score, article_records);
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
              debugResult(top_label[i], spot_id, frequency);

            }

          }//end loop

          //add new data to array
          spot_label_matrix.push({spot_id: spot_id, matrix: frequency_matrix});

          //update counter
          spot_label_matrix_counter++;

        }//end function

        /*
        * feature: change the value of the array from
        * */
        function updateMatrix(article_records, spot_label_matrix) {

          var spot_label_matrix_num = spot_label_matrix.length,
            update_spot_vectors = [],
            update_decide_counter = 0,
            update_spot_vector_index = [],
            update_spot_vector_index_sum = [],
            non_update_spot_vectors = [],
            update_vector;

          //console.log("article_record: ", article_records, "spot_label_matrix: " ,spot_label_matrix);

          function makeUpdateSpotVectors(update_spot_vector_index_sum) {
            var index_num = update_spot_vector_index_sum.length,
              update_vector = [0,0,0,0,0,0,0,0,0,0],
              spot_label_matrix_test = [],
              counter = 0;

            update_vector[ update_spot_vector_index_sum[0].update_index ] = 1;
            spot_label_matrix_test[0] = {
              spot_id: update_spot_vector_index_sum[0].spot_id,
              matrix: update_vector
            };

            for(var i=0; i<index_num; i++){

              for(var j=0; j<spot_label_matrix_test.length;j++){

               if(update_spot_vector_index_sum[i].spot_id == spot_label_matrix_test[j].spot_id ){
                  counter++;
                 spot_label_matrix_test[j].matrix[ update_spot_vector_index_sum[i].update_index ] = 1;

               }
               else if(update_spot_vector_index_sum[i].spot_id != spot_label_matrix_test[j].spot_id){

                 update_vector[ update_spot_vector_index_sum[i].update_index ] = 1;
                 spot_label_matrix_test[i] = {
                   spot_id: update_spot_vector_index_sum[i].spot_id,
                   matrix: update_vector
                 };

               }

             }// end loop

             update_vector = [0,0,0,0,0,0,0,0,0,0];

            }//end loop

            //Note: there have a same value that should not be

            return spot_label_matrix_test;

          }//end func

          //find the index of spot that have 1
          for(var i=0; i<spot_label_matrix_num;i++){
            for(var j=0;j<spot_label_matrix_num;j++) {

              if (spot_label_matrix[i].spot_id == spot_label_matrix[j].spot_id) {//update case

                  //findUpdateValue(spot_label_matrix[i].spot_id, spot_label_matrix);
                  update_spot_vector_index.push( spot_label_matrix[i].matrix.indexOf(1) );

              }//end if
            }//end loop

            update_spot_vector_index_sum.push({
              spot_id: spot_label_matrix[i].spot_id,
              update_index: update_spot_vector_index[0]
            });
            update_spot_vector_index = [];

          }//end loop

          console.log("update_spot_vector_index_sum", update_spot_vector_index_sum);
          var spot_label_matrix_update = makeUpdateSpotVectors(update_spot_vector_index_sum);

          return spot_label_matrix_update;
          //console.log("update_spot_vectors: ",update_spot_vectors, "\n");
          //console.log("non_update_spot_vectors: ",non_update_spot_vectors, "\n");

        }//end func

        /*
        * feature: make the result matrix
        * note: spot_label_matrix is the spot vector
        * */
        function makeMatrix(spot_id, label_id, top_label, add_default_length, label_score, article_records ,callback) {

          //debug the spot id that match with the label for recommend
          console.log("spot id: ", spot_id);

          for (var i = 0; i < spot_id.length; i++) {
            //this function will update the value of spot_label_matrix.
            addMatrix(spot_id[i], label_id[i], 1, top_label.label_id);
          }

          var spot_label_matrix_update = updateMatrix(article_records, spot_label_matrix);

          algorithm_result = algorithmCalculate(label_score, spot_label_matrix_update, spot_id);

          console.log("algorithm_result: " + algorithm_result[0].spot_id);

          spot.find({
            select: ['spot_name'],
            where: {spot_id: algorithm_result[0].spot_id}
          }).exec(function (err, spot_db) {

            var spot_vector = [],
              spot_vector_id = [],
              cosine_degree = [];

            //make a spot variables
            for(var l=0; l<algorithm_result.length; l++){
              spot_vector[l] = algorithm_result[l].spot_vector;
              spot_vector_id[l] = algorithm_result[l].spot_id;
              cosine_degree[l] = algorithm_result[l].cosine_degree;
            }

            //send to the fnc that make decision for question or recommend
            conversationDecision(
              algorithm_result[0].cosine_degree,
              spot_db[0].spot_name,
              algorithm_result[0].spot_id,
              current_conversation,
              top_label,
              algorithm_result[0].user_vector,
              spot_vector,
              spot_vector_id,
              cosine_degree
            );

          });
        }

        async.waterfall([
          defaultLabel,
          feedbackLabel,
          generateTopLabel,
          makeUserMatrix,
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
      * feature: find the default label
      * */
      function defaultLabel(callback) {
        label.query(top_label_default_query, function (err, default_label_records) {
          callback(null, default_label_records);
        });
      }

      /*
      * feature: find feedback label
      * parameter:
      *   func -> defaultLabel(require)
      * */
      function feedbackLabel(default_label_records, callback) {
        label.query(top_label_feedback_query, function (err, feedback_label_records) {
          callback(null, default_label_records, feedback_label_records);
        })
      }

      /*
      * feature: use the feedback label and default label to make a top label
      * parameter:
      *   func -> feedbackLabel(require)
      * */
      function generateTopLabel(default_label_records, feedback_label_records, callback) {

        var default_label_length = default_label_records.length,
          feedback_label_length = feedback_label_records.length,
          add_default_length = calculate_dimension-feedback_label_length,
          top_label = {label_id:[], label_name:[]};

        console.log("add_default_length: ", add_default_length);
        console.log("default_label_records: ", default_label_records);


        if(default_label_records.length < 10){
          makeLog(end_state, end_recommend_component, async_off);
          return res.json({
            answer:"There are not enough label for this user"
          });
        }

        //add default label into top label
        for(var l=0; l<add_default_length;l++){
          top_label.label_id.push(default_label_records[l].label_id);
          top_label.label_name.push(default_label_records[l].label_name);
        }
        //add feedback label into top label
        for(var i=0; i<feedback_label_length;i++){
          top_label.label_id.push(feedback_label_records[i].label_id);
          top_label.label_name.push(feedback_label_records[i].label_name);
        }

        callback(null, top_label, add_default_length);

      }

      /*
       * feature: generate the question of the chat-bot. this function will active
       *        in case that bot decide to asking the question to user(not to answer or recommend).
       * logic:
       *  1.) if the message come is the start conversation. The first index of array of top label can be ask.
       *  2.) if not there has to be in 2 case.
       *  3.)
       * */
      function botAskQuestion(current_conversation, conversation_step, top_label_records, user_vector, spot_vector, spot_id, spot_name, spot_vector_id, cosine_degree) {

        /*
         *
         * feature: find top label from DB
         * */
        function chooseLabel(top_label, add_default_length, callback) {

          var question_num = countQuestion(current_conversation, conversation_step);

          console.log("top label id: ", top_label);

          //for first time that bot ask user.There no need to make user vector
          if (conversation_step == 2) {
            callback(null, top_label.label_id[0], top_label.label_name[0], top_label, cosine_degree);
          }
          else {
            if(question_num < add_default_length) {// range of the default label. It mean can make question

                makeUserMatrix(current_conversation, conversation_step);
                callback(null, top_label.label_id[question_num], top_label.label_name[question_num], top_label, cosine_degree);

            }
            else{// when have noting to ask user . end of 10 dimension
              makeLog(end_state, end_recommend_component, async_off);
              botLogRecord(top_label, conversation_step);
              return res.json({
                answer: "Can't find your suit location. Please try again"
              });
            }

         }//end else

        }//end func

        async.waterfall([
          defaultLabel,
          feedbackLabel,
          generateTopLabel,
          chooseLabel
        ], function (err, label_id, label_name, top_label, cosine_degree) {

          return res.json({
            answer: "Do you interested in " + label_name + "?",
            user_vector: user_vector,
            spot_vector: spot_vector,
            spot_id: spot_vector_id,
            top_label: top_label,
            cosine_degree: cosine_degree
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
      function conversationDecision(cosine_degree, spot_name, spot_id, current_conversation, top_label_records, user_vector, spot_vector, spot_vector_id, cosine_degree_vector) {

        //note: we should make some algorithm for decide threshold
        var state_threshold = 60,
          component_id = current_conversation[current_conversation.length - 1].component_id;

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

          callback(null, label_id);

        }

        function thresholdDecision(label_id, callback) {

          if (cosine_degree < state_threshold) {//answer question
            //userFeedback(current_conversation, current_conversation.length, spot_id);

            console.log("top_label_records: ", top_label_records);

            makeLog(end_conversation, end_recommend_component, async_off);
            botLogRecord(top_label_records, current_conversation.length);

            return res.json({
              answer: "Then I recommend: " + spot_name,
              feedback_question: "Like or Dislike?"
            });
          }
          //note: even length and threshold is ==, It return false. Bug?
          else if (cosine_degree >= state_threshold) {//ask question
            botAskQuestion(
              current_conversation,
              current_conversation.length,
              top_label_records,
              user_vector,
              spot_vector,
              spot_id,
              spot_name,
              spot_vector_id,
              cosine_degree_vector
            );
          }
          else {
            return res.json({
              answer: "Error: Yes or No case"
            });
          }
        }

        async.waterfall([
          //recordFeedback,
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

            // if property "component_id" return undefined the server we frost,
            // So in case of undefined this value will auto converted into null

            var component_id = record[i - 1].component_id;

            if (component_id == end_conversation) {

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

            //user_label_score = makeUserMatrix(current_conversation, current_conversation.length);
            labelRecommend(current_conversation);
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
       *   2.) integer -> conversation id.
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

