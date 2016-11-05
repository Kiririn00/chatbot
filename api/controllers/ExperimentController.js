/**
 * Created by Varit on 10/21/16.
 */

module.exports = {

  SpotPreference: function (req, res) {

    var similarity = require( 'compute-cosine-similarity' );

    var err_msg = "Still not get a POST's data";
    var user_preference = [];

    function apiRes(api_res) {
      return res.json({answer:api_res});
    }

    function callBack() {}

    function degreeConvert(temple_cosine,natural_cosine,history_cosine){

      console.log(temple_cosine,natural_cosine,history_cosine);

      var temple_degree = Math.acos(temple_cosine) * (180/Math.PI);
      var natural_degree = Math.acos(natural_cosine) * (180/Math.PI);
      var history_degree = Math.acos(history_cosine) * (180/Math.PI);

    }

    //calculate cosine
    function cosineCalculate(user_preference){

      //define preference variable of DB
      var temple_preference  = [],
          natural_preference = [],
          history_preference = [];
      var temple_cosine,natural_cosine,history_cosine;

      preference.find({},function (err,found) {

        callBack();

        for(var i=0;i<found.length;i++){

          temple_preference[i] = found[i].temple;
          natural_preference[i] = found[i].natural;
          history_preference[i] = found[i].history;
        }

        console.log(user_preference,temple_preference,natural_preference,history_preference);

        //all cosine calculate
        temple_cosine = similarity(user_preference, temple_preference);
        natural_cosine = similarity(user_preference, natural_preference);
        history_cosine = similarity(user_preference, history_preference);

        //convert cosine to degree
        degreeConvert(temple_cosine,natural_cosine,history_cosine);

      });

    }

    if(req.method == 'POST'){
      var preference1 = req.param('preference1');
      var preference2 = req.param('preference2');
      var preference3 = req.param('preference3');
      var feedback = req.param('feedback');

      sails.log("post data:"+ preference1,preference2,preference3,feedback);

      user_preference = [preference1,preference2,preference3]

      var cosine = cosineCalculate(user_preference);
    }
    else{
      apiRes(err_msg);
    }


    return res.json();
  }

};
