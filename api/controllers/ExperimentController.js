/**
 * Created by Varit on 10/21/16.
 * This is Controller.
 * This controller is use for make a experiment program.
 */

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

  /*
  * Preference is use for calculate a cosine data
  *
  * INPUT: user's preference(from browser), spot_preference(from database)
  * OUTPUT: cosine degree
  * */
  Preference: function (req, res) {

    //similarity package is use for calculate cosine
    var similarity = require( 'compute-cosine-similarity' );
    //auto_http package will show HTTP method information on console
    var auto_http = require('auto_http');

    var sortBy = require('sort-array');

    var err_msg = "Still not get a POST's data";

    /*
    * function apiRes is use for error case.
    * The error case mean, server-side can not response the POST data(HTTP Error 400+)
    *
    * parameter: string -> api_res is error message. You can change by edit err_msg.
    * return: JSON -> It will return response with JSON error data of err_msg(key name is "answer").
    * */
    function apiRes(api_res) {//tell error
      return res.json({answer:api_res});
    }

    /*
    * function degreeConvert is use for convert similarity cosine to degree
    *
    * parameter: array -> cosine is float data of cosine .
    * return: array -> float data of degree.
    * */
    function degreeConvert(cosine){

      var cosine_degree = [];

      for(var i=0;i<cosine.length;i++){

        cosine_degree[i] = Math.acos(cosine[i]) * (180/Math.PI);//this will convert cosine to degree

      }

      return cosine_degree;

    }

    function combinePreference(spot_name,cosine_degree){

      var combine_preference = [];
      var preference_length = cosine_degree.length;

      for(var i=0; i< preference_length;i++){

        combine_preference.push({
          spot_name: spot_name[i][0],
          cosine_degree: cosine_degree[i]
        });

      }

      return combine_preference;

    }

    /*
    * function cosineCalculate will calculate by use compute-cosine-similarity
    * package. It will calculate between user's preference and spot_preference.
    *
    * call function: degreeConvert
    * parameter:
    *    array -> user_preference
    *    object array -> found
    * return: array -> cosine degree
    * */
    function cosineCalculate(user_preference,found,spot_name_raw){

      var cosine = [];
      var spot_preference = [];
      var cosine_degree;
      var spot_name = [];
      var spot_number = found.length;
      var combine_preference;

      for(var i=0;i<spot_number;i++) {

        spot_preference[i] = Object.keys(found[0]).map(function (key) {
          //console.log("Debug cosine: "+found[i][key]);
          return found[i][key];
        });

        spot_name[i] = Object.keys(spot_name_raw[0]).map(function (key) {
          //console.log("Debug spot_name: ",spot_name_raw[i][key]);
          return spot_name_raw[i][key]; //why return be 2D array
        });

        //user preference have only one preference, beside spot_preference has many record
        cosine[i] = similarity(user_preference, spot_preference[i]);

      }//end loop

      cosine_degree = degreeConvert(cosine);

      combine_preference = combinePreference(spot_name,cosine_degree);

      return combine_preference

    }//end of function



    //メイン処理
    if(req.method == 'POST'){

      auto_http.start(req);//debug as HTTP details

      var preference_number = req.param('preference_number');//user's preference number
      var feedback = req.param('feedback');
      var user_preference = JSON.parse(req.param('user_preference'));

      var spot_name;
      var preference;
      var query_limit = 10;

      // query all spot_preference
      var query = "SELECT çtemple`, `natural`, `history`, `lake`, `castle`, `museum`, `market`, `mountain`, `train`, `seichi` FROM `preference_mock` WHERE 1 LIMIT "+query_limit;

      var spot_query = "SELECT `spot_name` FROM `preference_mock` WHERE 1 LIMIT "+query_limit;

      //execute mySQL
      preference_mock.query(query, function (err, found) {//found is spot_preference's data

        if (err) { //if query is error
          return res.serverError(err);
        }

        //debug input of the user's preference›
        //sails.log("INPUT user preference: ", user_preference);

        preference_mock.query(spot_query, function (err, spot_name) {

          if (err) { //if query is error
            return res.serverError(err);
          }

          //calculate cosine degree
          preference = cosineCalculate(user_preference,found,spot_name);

          //sort cosine degree

          preference.sort(function (a,b) {

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

          //debug output of of cosine degree
          sails.log("OUTPUT cosine degree: ", preference);

          return res.json({
            response: preference
          });

        });//end find spot's DB

      });//end find DB

    }
    else{
      apiRes(err_msg);
    }

  },//end action

  PreferenceName: function (req,res) {

    /*
     logic
     1.) make preference name of array. {["temple"],[lake],...}
     1.1)array will come from DB data
     2.) index of array must to be same to the number of preference.
     3.) label on input form
     4.) in label's put array in it.
     */

    var preference_name_query = "DESCRIBE preference_mock";

    var preference_num = 12;
    var start_column = 2;
    var preference_name = [];
    var preference_name_index = 0;

    preference_mock.query(preference_name_query, function (err,found) {

      if(err){
        return res.serverError;
      }

      for(var i=start_column;i<preference_num;i++) {

        preference_name[preference_name_index] = found[i].Field;

        preference_name_index++;

      }

      return res.json({
        preference_name:preference_name
      });

    });//end query


  },//end action


  LabelName: function (req,res) {

    /*
    feature: get label name
    logic
     1.) make label name of array for save label name's data. {["temple"],[lake],...}
     1.1) value of array will come from DB data.
     2.) Find column label_name make loop for pick all of data to array.
    return:JSON
     label_name: array of label_name column's dara.
    */

    var label_limit = 10;

    label.find({select: ['label_name','label_score']}).sort('label_score DESC').limit(label_limit).exec(function (err, records) {

      if(err){return res.serverError(err); }

      else{

        return res.json({
          label:records
        })
      }

    });//end find

  },//end action

  /*
  * feature: add or update label to DB
  * logic
  *   1.) get input label name from view.
  *   2.) make condition[a] for check is new one or already has in DB.
  *   3.) if it's already have in DB, So update by +1 label score
  *   4.) else if condition[a] does not have in DB. Make a new record.
  * return:JSON
  *   1.) return top 10 preference score.
  *   2.) top 10 preference data
  * */
  AddOrCreateLabel: function (req,res) {

    var auto_http = require('auto_http');

    auto_http.start(req);

    if(req.method == 'POST'){

      var add_label = req.param('add_label');
      var query_find = [{label_name: add_label}];
      var query_new_record = [{
        label_name: add_label,
        label_score: 1
      }];

      function newRecord() {

        label.create(query_new_record).exec(function (err, finn) {

          if(err){console.log("ERROR");}
          else{console.log(finn);}

        });

      }

      function updateRecord(update_id) {

        var query_update_record =
          "UPDATE label SET label_score = label_score + 1 WHERE label_id = "+update_id+";";

        label.query(query_update_record, function (err, updated) {

          if(err){console.log("ERROR");}
          else{console.log(updated);}

        });

      }

      label.find(query_find).exec(function (err,records) {

        if(err){return res.serverError;}
        else{

          console.log(records);

          if(records == ""){
            console.log("new record case");
            newRecord();
          }
          else{
            console.log("update record case");
            updateRecord(records[0].label_id);
          }

        }

      })

    }// end if POST

    return res.json();
  },//end action

  /*
  * feature: recommend spot name by [x] algorithm
  * logic:
  *  1.) request label's score data from view
  *   1.1) from view will pick 2 data label_name[a], label_score[b], label_id[c]
  *  2.) query for pick top 10 of label_name spot_name from DB
  *  3.) find frequency of top 10 label's spot[y]
  *  4.) use algorithm [x] for calculate between [y] with [b]
  *  return: JSON
  *  1.) ARRAY: recommend spot's weight
  * */

  LabelRecommend: function (req,res) {

    var auto_http = require('auto_http');
    var similarity = require( 'compute-cosine-similarity' );
    var XLSX = require('XLSX');
    auto_http.start(req);

    if(req.method == 'GET'){

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
      * feature: use for show name of any id and what it calculate
      * parameter:
      *   1.) integer -> label_id,
      *   2.) integer -> spot_id,
      *   3.) integer -> label x spot frequency
      * */
      function debugResult(label_id, spot_id, frequency) {

        console.log("used debug");

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

              console.log("debug: ",debug_result);
            }

            });
          });

      }//end function

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

      function updateMatrix() {

      }

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

      return res.json();
    }//end if get

  },

  /*
  * feature: show view of LabelList
  * */
  LabelList: function (req,res) {

    res.locals.layout = 'layout2';

    return res.view();
  }

};
