/**
 * Created by Varit on 10/21/16.
 * This is Controller.
 * This controller is use for make a experiment program.
 */

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
      var query = "SELECT `temple`, `natural`, `history`, `lake`, `castle`, `museum`, `market`, `mountain`, `train`, `seichi` FROM `preference_mock` WHERE 1 LIMIT "+query_limit;

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
  *     2.1) The way of the Condition is compare between 2 variable[b][c].
  *     2.2) variable[b]'s value is id of record that already has in database OR
  *          last id (new record)
  *     2.3) After get variable[b] variable[c] will get the currently last id of table
  *   3.) if condition[a], [b] and [c] is match so it should update record.
  *     3.1) So how condition[a] work is compare the 2 last_id is [b][c].
  *     3.2) First [b] will return last_id or matched id
  *     3.3) If [b] is last id, [b] and [c] should be the same. That mean
  *   4.) else if condition[a] does not save in DB. Make a new record.
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

  ShowPreferenceList: function (req,res) {

    res.locals.layout = 'layout2';

    return res.view();
  }

};
