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
    answer: api_res,
    component_id: 0
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

      var log_query = {select: ['component_name']};

      function taskA() {
        component.find(log_query).exec(function (err, record) {
          //console.log("return record", record);
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
      start_component = 2,
      end_component = 3,
      yes_component = 4,
      no_component = 5;

    if(msg == null){
      return api_res(res, "no msg")
    }
    else if(!req.isSocket) {
      return api_res(res, "no socket ")
    }

    /*
    * feature: calculate weight of spot by use 2 matrix
    * parameter:
    *   1.) array[10] -> matrix of label score
    * */
    function labelRecommend(){

      var similarity = require( 'compute-cosine-similarity' );

      //this is [a,b]
      var label_name = JSON.parse(req.param('label_name')),
        label_score = JSON.parse(req.param('label_score')),
        query = "SELECT DISTINCT article.label_id, article.spot_id, label.label_score, COUNT(*) AS 'Num' \n" +
          "FROM (SELECT * FROM label ORDER BY label.label_score DESC LIMIT 10) label \n" +
          "INNER JOIN article \n" +
          "ON label.label_id = article.label_id \n" +
          "GROUP BY label.label_id, article.spot_id \n" +
          "ORDER BY label.label_score DESC\n";

      var spot_label_matrix = [],
        spot_label_matrix_counter = 0,
        top_label_query = {select:['label_id']},
        top_label_query_limit = 10,
        top_label_query_sort = "label_score DESC";

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

        console.log(result);

        return result;

      }

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

            debugResult(top_label[i], spot_id, frequency);

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
        }

        console.log(top_label);

        if(err){console.log(err);}
        else{}

        //make matrix
        label.query(query, function (err, records) {

          if(err){console.log(err)}
          else {

            for(var i=0; i<records.length; i++) {

              addMatrix(records[i].spot_id, records[i].label_id, records[i].Num, top_label);

            }

            algorithm_result = algorithmCalculate(label_score, spot_label_matrix);
            //logRecords(spot_label_matrix, algorithm_result, top_label);

            //console.log(spot_label_matrix);

          }

        });//end label query

      });//end label find

    }//end function

    /*
    * feature: make conversation for recommend spot of chat-bot
    * parameter: array -> set of answer
    * return: string -> conversations
    * */
    function recommendSpot(conversation) {

      console.log("input parameter: ", conversation);

      var log_query = {
        select:[
          'log_id',
          'component_id',
          'message'],
        where:{
          or :[
            {component_id:start_component},
            {component_id:end_component},
            {component_id:yes_component},
            {component_id:no_component}
          ]
        }
      },
        new_log_query = [{
          component_id: end_component,
          message:"Error"
        }],
        index_end_component;


      log.find(log_query).sort('log_id ASC').exec(function (err, record) {
        //if start is last index add end
        //note: this method is not good. May be we should change component number to
        //end component instead add a new log. Because log should insert by only
        //user's input.
        //note2: in debug's log it's not show newest record that add by this function
        /*
        function clearConversation() {
          if (record[record.length - 1].component_id == start_component) {
            log.create(new_log_query).exec(function (err, record) {
            });
          }
        }
        */

        console.log("debug: \n",record);

        function countProcess() {

          //find end component
          for (var i = record.length; i >= 0; i--) {

            if (record[i-1].component_id == end_component) {

              //console.log("log id of end component: ", record[i-1].log_id);
              index_end_component = i-1;
              break;

            }

          }//end loop

          console.log("index of end component: ", index_end_component);

          //after last end component
          for (var l = index_end_component; l < record.length; l++) {

            console.log("conversation: ",record[l]);
          }


        }
        promise
          //.then(clearConversation)
          .then(countProcess)
          .catch(onRejected);



      });//end find

      return res.json({
        answer:"recommend case",
        component_id: conversation.component_id
      });

    }

    /*
    * feature: record log
    * */
    function logRecord(component_id) {

      var log_query = [{
        component_id: component_id,
        user_id: user_id,
        message: msg
      }];

      log.create(log_query).exec(function (err, record) {});
    }

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

          //make log
          if(conversation.length != 0) {//match
            logRecord(conversation[0].component_id);
          }

          if(conversation.length == 0){return api_res(res, err_msg);}

          var component_query = {select:['component_name', 'component_id'], where:{component_id: conversation[0].component_id}};

          component.find(component_query).exec(function (err, record) {

            if(record[0].component_id == 1){//stopsentence case
              return res.json({
                answer:conversation[0].answer,
                component_id:1
              });
            }
            else if(record[0].component_id >= 2 ){//recommend case
              recommendSpot(conversation[0]);
            }
            else{//no match case
              logRecord(end_component);
              return api_res(res, err_msg);
            }

          });//end component find

        });//end log find

      });//end join room

    }//end function

    //debug check message from view
    console.log("Debug data from view: "+msg);
    console.log("Debug check status of feedback: "+feedback_switch);

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

