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

    var preference_name_query = "DESCRIBE preference_mock";

    preference_mock.query(preference_name_query, function (err,found) {

      if(err){
        return res.serverError;
      }

      console.log(found);

    });

  }//end action

};
