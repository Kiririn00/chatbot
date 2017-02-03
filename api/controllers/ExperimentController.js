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
  *  1.) ARRAY: recommend spot
  * */

  LabelRecommend: function (req,res) {

    var auto_http = require('auto_http');

    auto_http.start(req);

    if(req.method == 'GET'){

      //this is [a,b]
      var label_name = JSON.parse(req.param('label_name')),
          label_score = JSON.parse(req.param('label_score')),
          label_id = [], label_length, label_db_name = [],
          label_id_non_object = [];
          label_query = {
            select: ['label_id','label_name','label_score']
          },
          label_query_sort = "label_score DESC",
          label_query_limit = 10;

      var article_select_query = {select: ['label_id','spot_id']},
          label_spot_frequency = [];

      var spot_select_query = {select: ['spot_name']},
          spot_name;

      var frequency_object;

      /*
      * feature: remove duplicate of value in array
      * parameter:
      *   1.) array
      * logic:
      *   1.) sort the array[a] that come from parameter.
      *   2.) array that has object num:1 will add to return array[r].
      *   3.) array that has object num > 1 will be a duplicate case.
      *   4.) make condition that index of array[a] must be in rage of index
      *       (can't be a undefined)
      *   5.) compare between current item and next item
      *   6.) if it is the same then add only first one to return array[r].
      *   7.) another one that duplicate will be ignore until next item is unique one.
      *   8.) if we find unique one, go again from 5.)
      * return: array
      *   spot_label_frequency: spot&label's id that removed duplicate
      * comment: we have to change this algorithm to another way.
      * */
      function removeDuplicate(spot_label_frequency) {

        spot_label_frequency = spot_label_frequency.sort(function (a,b){

          if(a.label_id < b.label_id){return -1;}
          if(a.label_id > b.label_id){return 1;}

        });

        console.log("before process \n", spot_label_frequency);

        //sortEqual(spot_label_frequency);

        var non_duplicate = [],
          non_duplicate_counter = 0,
          duplicate_num = spot_label_frequency.length,
          duplicate_frequency,
          current_label_id,
          next_label_id,
          current_spot_id,
          next_spot_id;

        var index;

        var detect_counter = 0;

        for(var i = 0; i<duplicate_num; i++) {

          if(spot_label_frequency[i].num == 1){
            non_duplicate[non_duplicate_counter] = {
              label_id: spot_label_frequency[i].label_id,
              spot_id: spot_label_frequency[i].spot_id,
              num: spot_label_frequency[i].num
            };

            non_duplicate_counter++;
          }

          index = spot_label_frequency.indexOf(spot_label_frequency[i]);

          if(index >= 0 && index < duplicate_num - 1){

            current_label_id = spot_label_frequency[index].label_id;
            next_label_id = spot_label_frequency[index+1].label_id;
            current_spot_id = spot_label_frequency[index].spot_id;
            next_spot_id = spot_label_frequency[index+1].spot_id;
            duplicate_frequency = spot_label_frequency[index].num;

            //duplicate case
            if(current_label_id == next_label_id && current_spot_id == next_spot_id && detect_counter == 0){

              detect_counter = 1;

              non_duplicate[non_duplicate_counter] = {
                label_id: next_label_id,
                spot_id: next_spot_id,
                num: duplicate_frequency
              };

              non_duplicate_counter++;

            }
            else{
              detect_counter = 0;
            }

          }

        }//end loop

        //console.log("after proceed \n",non_duplicate);

        return non_duplicate;

      }//end function

      /*
      * feature: make array of spot x label matrix
      * parameter: array -> group of label_id &spot_id & num
      * logic:
      *   1.) loop by length of array's parameter[p]
      *   2.)
      * return: array
      *   1.) 10 dimension of matrix
      * */
      function makeSpotLabelMatrix(group_array, top_label) {

        sortObjectArray(group_array, "spot_id");

        console.log("non-duplicate \n", group_array);
        console.log("top10 label \n", top_label);

        //sort spot_id for

        var spot_label_matrix = [],
          spot_label_matrix_counter = 0,
          group_array_num = group_array.length,
          top_label_list = top_label,
          update_counter = 0;

        /*
        * feature: add matrix to return array
        * parameter:
        *   1.) integer -> spot id
        *   2.) integer -> label_id
        *   3.) integer -> frequency
        * */
        function addMatrix(spot_id, label_id ,frequency) {

          var label_index = 0,
            frequency_matrix = [0,0,0,0,0,0,0,0,0,0];

          //find label's index
          for(var i=0; i<top_label_list.length; i++){

              if (top_label_list[i] == label_id) {

                label_index = top_label_list.indexOf(label_id);

                //increase matrix
                frequency_matrix[label_index] = frequency;

              }

          }//end loop

          //add new data to array
          spot_label_matrix.push({spot_id: spot_id, matrix: frequency_matrix });

          //update counter
          spot_label_matrix_counter++;

        }//end function

        /*
        * feature: update matrix
        * parameter:
        *   1.) integer -> spot_index
        *   2.) integer -> label_index
        *   2.) integer -> frequency of spot&label
        * */
        function updateMatrix(spot_id, label_index, frequency) {

          console.log("update");

          update_counter = 1;
        }//end function

        //make matrix
        for(var i=0; i<group_array_num; i++) {

          if(i >= 0 && i < group_array_num) {

              if (i == group_array_num - 1) {//last index case

                if (group_array[i].spot_id == group_array[i - 1].spot_id) {
                  updateMatrix();
                }
                else {
                  addMatrix(group_array[i].spot_id, group_array[i].label_id, group_array[i].num)
                }

                break;

              }

              //update case
              if (group_array[i].spot_id == group_array[i + 1].spot_id) {

                updateMatrix(group_array[i].spot_id, group_array[i].label_id, group_array[i].num);

              }
              else if (update_counter == 0) {//first same case will add

                addMatrix(group_array[i].spot_id, group_array[i].label_id, group_array[i].num);

              }
              else if (group_array[i].spot_id != group_array[i + 1].spot_id) {//add case

                addMatrix(group_array[i].spot_id, group_array[i].label_id, group_array[i].num);
                update_counter = 0;

              }


          }

        }

        console.log("matrix: \n", spot_label_matrix);

      }//end function

      /*
      * feature: find number of frequency of spot and label that be the same.
      * parameters:
      *   1.) array -> label and spot's id
      * */
      function countFrequencyLabelSpot(records, top_label) {

        //console.log("top 10 label id that's match to spot id \n",records);

        function takeOnlyOneObject(array) {

          var one_obj = [];

          for(var i=0; i<array.length; i++){

            one_obj[i] = array[i].num;

          }

          return one_obj

        }//end function

        var current_spot_id = [],
            current_label_id = [],
            check_spot_id = [],
            check_label_id = [],
            label_spot_num = records.length;

        var spot_label_frequency = [],
            spot_label_frequency_counter = 1;

        var non_duplicate,
            frequency_object;

        for(var i=0;i<label_spot_num;i++){

          current_spot_id[i] = records[i].spot_id;
          current_label_id[i] = records[i].label_id;

          for(var j=0;j<label_spot_num;j++){

            check_spot_id[j] = records[j].spot_id;
            check_label_id[j] = records[j].label_id;

            if(current_spot_id[i] == check_spot_id[j] && current_label_id[i] == check_label_id[j]){

              spot_label_frequency[i] = {
                label_id: current_label_id[i],
                spot_id: current_spot_id[i],
                num: spot_label_frequency_counter++
              };

            }//end if

          }//end loop for j

          //reset counter
          spot_label_frequency_counter = 1;

        }//end loop for i

        //console.log("spot x label's frequency \n",spot_label_frequency);

        non_duplicate = removeDuplicate(spot_label_frequency);

        makeSpotLabelMatrix(non_duplicate , top_label);

        frequency_object = takeOnlyOneObject(non_duplicate);

        return frequency_object;
      }//end function

      /*
      * feature: use x algorithm for proceed weight of content
      * parameter:
      *   1.)array: data from user
      *   2.)array: data from db
      *
      * */
      function recommendCalculate(personal_data, db_data) {

        //console.log(personal_data, db_data);

      }

      //find label table for label_name and label_db_id
      label.find(label_query).sort(label_query_sort).limit(label_query_limit).exec(function (err, records) {

        if(err){console.log(err);}

        else{

          label_length = records.length;

          //make label id array
          for(var i=0; i<label_length;i++){
            label_id[i] = {label_id:records[i].label_id};
            label_db_name[i] = {label_db_name:records[i].label_name};
            label_id_non_object[i] = records[i].label_id;
          }

          article.find(label_id,article_select_query).exec(function (err, records) {

            if(err){console.log(err);}
            else {

              frequency_object = countFrequencyLabelSpot(records, label_id_non_object);

              recommendCalculate(label_score, frequency_object);

            }// end else

          });//end find article

        }//end else

      });//end find label

      return res.json();
    }

  },

  /*
  * feature: show view of LabelList
  * */
  LabelList: function (req,res) {

    res.locals.layout = 'layout2';

    return res.view();
  }

};
