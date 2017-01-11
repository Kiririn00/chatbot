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

  PreferenceName: function (req,res) {

    /*
    logic
     1.) make preference name of array. {["temple"],[lake],...}
     1.1) array will come from DB data
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

  /*
  * feature: add or update preference to DB
  * logic
  *   1.) get input preference name[a] from view.
  *   2.) make condition for check [a] is new one or already has in DB.
  *   3.) if [a] had in DB, update DB by +1 score. and if preference_value
  *   still 0 change to 1.
  *   4.) else if [a] does not save in DB. Make a new record.
  * return:JSON
  *   1.) return top 10 preference score.
  *   2.) top 10 preference data
  * */
  AddPreference: function (req,res) {

    var auto_http = require('auto_http');

    auto_http.start(req);

    if(req.method == 'POST'){

      var add_preference = req.param('add_preference');

      var query_find = [{preference_name: add_preference}];
      var query_new_record = [{
        preference_name: add_preference,
        preference_score: 0,
        preference_value: 0
      }];

      //work as logic number 2
      preference.findOrCreate(query_find,query_new_record).exec(function (err, records) {

        if(err){ return res.serverError(err); }

        var add_or_update_record = records;

        //find current last id of DB. this will use for decide update or create.
        preference.find({select: ['id']}).sort('id DESC').limit(1).exec(function (err, records) {

          var last_id = records[0].id,
            record_id = add_or_update_record[0].id;

          //debug compare between last_id and record_id(id that we want to update)
          /*
          console.log("last id: ", last_id);
          console.log("get record id: ", record_id);
          */

          if(last_id != record_id){//update case

            var query_update =
              "UPDATE preference SET preference_value = "+record_id+", preference_score = preference_score + 1 WHERE id = 1;";

            preference.query(query_update, function (err, updated) {

              if(err){ return res.serverError(err); }

              console.log("updated: ",updated);

            });

          }
          else{//new record case
            console.log("new record case");
          }

        });

      });

    }// end

    return res.json();
  },//end action

  ShowPreferenceList: function (req,res) {

    res.locals.layout = 'layout2';

    return res.view();
  }

};
