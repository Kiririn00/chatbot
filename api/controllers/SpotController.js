//this is HomeController

var request = require('request');
var http = require('http');
global.jQuery = require('jquery');



module.exports = {

  index: function (req, res) {

    return res.view();

  },

  debug: function(req,res){

    return res.view();
  },

  Home: function (req,res){

    //special layout for home.ejs
    res.locals.layout = 'layout2';
    return res.view();
  },

  ShowSpot: function (req,res){

    var spot;

    if(req.method = 'GET') {
      spot = req.param('spot');
    }

    //SQL error case
    function error(err){
      console.log(err);
    }

    //SQL no error case
    function sql_result(result){
      console.log(result);
    }

    //SQL query:+1 every time to column.column will pass in parameter
    function sql_operation(spot_name){

      rate.query('UPDATE rate SET score = score + 1 WHERE spot_name = "'+spot_name+'"', function (err, result) {
        if (err){
          error(err);
        }
        else{
          sql_result(result);
        }
      });

    }

    //case condition if GET data match string then query for +1 that column
    if(spot == "heizan"){

      sql_operation("heizan");

    }

    else if(spot == "omi"){

      sql_operation("omi");

    }

    else if(spot == "hikone"){

      sql_operation("hikone");

    }

    res.locals.layout = 'layout2';

    //send GET data to view
    return res.view({
      spot: spot
    });

  },

  SearchResult : function (req,res){
    //if post data come
    if(req.method == 'POST') {
      //get post data will use as tree attribute
      var type = req.param("type");
      var category = req.param("category");
      var good_for = req.param("good_for");

      var ati1 = 0,ati2 = 0,ati3 = 0;
      var ati1_name,ati2_name,ati3_name;
      var ans_case = 0 ;

      //debug post data
      console.log("POST DATA:"+type+" "+category+" "+good_for);
      //define type's name
      var type_name = ["exploration","walking-travel"];
      //define category's name
      var category_name = ["recreational","national"];
      //define good for's name
      var good_for_name = ["family","one-man","couple"];

      //--------------------decision tree algorithm-------------------------------------------//

      if(type == 0){//node layer 1 case 1
        ati1 = 0;
        if(category == 0){//node layer 2 case 1
          ati2 = 0;
          if(good_for == 0){//node layer 3 case 1
            ati3 = 0;
            ans_case = 1; //case 0,0,0
          }
          else if(good_for == 1){//node layer 3 case 2
            ati3 = 1;
            ans_case = 2;//case 0,0,1
          }
          else if(good_for == 2){//node layer 3 case 3
            ati3 = 2;
            ans_case = 3;//case 0,0,2
          }
          else{//error in layer 3

          }
        }
        else if(category == 1){//node layer 2 case 2
          ati2 = 1;
          if(good_for == 0){//node layer 3 case 1
            ati3 = 0;
            ans_case = 4;//case 0,1,0
          }
          else if(good_for == 1){//node layer 3 case 2
            ati3 = 1;
            ans_case = 5;//case 0,1,1
          }
          else if(good_for == 2){//node layer 3 case 3
            ati3 = 2;
            ans_case = 6;//case 0,1,2
          }
          else{//error in layer 3

          }
        }
        else{//error in layer 2

        }
      }//end if type==0

      else if(type == 1){// node layer 1 case 2
        ati1 = 1;
        if(category == 0){//node layer 2 case 1
          ati2 = 0;
          if(good_for == 0){//node layer 3 case 1
            ati3 = 0;
            ans_case = 7;//case 1,0,0
          }
          else if(good_for == 1){//node layer 3 case 2
            ati3 = 1;
            ans_case = 8;//case 1,0,1
          }
          else if(good_for == 2){//node layer 3 case 3
            ati3 = 2;
            ans_case = 9;//case 1,0,2
          }
          else{//error in layer 3

          }
        }
        else if(category == 1){//node layer 2 case 2
          ati2 = 1;
          if(good_for == 0){//node layer 3 case 1
            ati3 = 0;
            ans_case = 10;//case 1,1,0
          }
          else if(good_for == 1){//node layer 3 case 2
            ati3 = 1;
            ans_case = 11;//case 1,1,1
          }
          else if(good_for == 2){//node layer 3 case 3
            ati3 = 2;
            ans_case = 12;//case 1,1,2
          }
          else{//error in layer 3

          }
        }
        else{//error in layer 2

        }

      }
      else{//error in layer 1

      }

      //get attribute result name
      ati1_name = type_name[ati1];
      ati2_name = category_name[ati2];
      ati3_name = good_for_name[ati3];
      //debug attribute and answer case
      console.log("attribute: "+ati1+" "+ati2+" "+ati3);//debug attributes
      console.log("attribute name: "+ati1_name+" "+ati2_name+" "+ati3_name);
      console.log("answer case:"+ans_case);

      //--------------- end decision tree algorithm---------------------------------------//

      //find content by SPARQL
      var query = "prefix category: <http://ldp.com/spot/category/>\n"+
        "prefix user:  <http://ldp.com/data/user/>\n"+

        "prefix type: <http://ldp.com/spot/category/type/>\n"+
        "prefix group: <http://ldp.com/spot/category/group/>\n"+
        "prefix for: <http://ldp.com/spot/category/for/>\n"+
        "prefix spot_name: <http://ldp.com/spot/spot_name/>\n"+

        "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema/>\n"+
        "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/>\n"+

        "prefix province: <http://www.province.com/>\n"+

        "SELECT ?subject ?p ?spotname \n "+
        "WHERE {?subject ?p ?spotname. \n" +
        "?subject category:type type:"+ati1_name+".\n"+
        "?subject category:group group:"+ati2_name+".\n"+
        "?subject category:for for:"+ati3_name+".\n"+
        "FILTER (lang(?spotname) = 'ja')\n"+
        "} \n"+
        "LIMIT 100";
      var output = "output=json";

      var options ={
        url: 'http://localhost:3030/Spot/query?query='+query+'&'+output
      };
      //debug URL that will send to fuseki2
      console.log(options);

      //callback function
      var result = [];
      var result_length = 0;
      //callback function
      function callback (callback_data){
        //console.log(callback_data);
        return callback_data;
      }

      //open I/O send data to fuseki2 (use GET)
      request(options, function(error, response , body){
        if(!error && response.statusCode == 200){//no HTTP error case
          result = body;
          result = callback(result);
          console.log("Fuseki2 result: \n"+result);//debug response from fuseki2
        }
        else{//HTTP Error
          console.log("HTTP Error: "+response.statusCode);//debug HTTP error code
          console.log("Fuseki2 result: "+body);//debug error result from fuseki2
        }

        //result = JSON.parse(result);
        //result_length = result.results.bindings.length;
        //console.log(result.results.bindings.length);
        return res.json({
          result: result
          //result_length:result_length
        });
      });

    }//end if post
    else{//if POST data not come
      console.log("Debug: no post data come");
      res.redirect('/Spot/Home');
    }


  },

  SpotContents : function(req,res){
    //if post data come
    if(req.method == 'POST'){
      var uri = req.param('uri');
      //debug post data "uri"
      console.log(uri);

      var query = "prefix category: <http://ldp.com/spot/category/>\n"+
        "prefix user:  <http://ldp.com/data/user/>\n"+

        "prefix type: <http://ldp.com/spot/category/type/>\n"+
        "prefix group: <http://ldp.com/spot/category/group/>\n"+
        "prefix for: <http://ldp.com/spot/category/for/>\n"+
        "prefix spot_name: <http://ldp.com/spot/spot_name/>\n"+

        "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema/>\n"+
        "prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/>\n"+

        "prefix province: <http://www.province.com/>\n"+

        "SELECT ?subject ?p ?content \n "+
        "WHERE {\n" +
        "<"+uri+"> ?p ?content .\n"+
        "FILTER (lang(?content) = 'ja') \n"+
        "} \n"+
        "LIMIT 100";

      var output = "output=json";
      var options ={
        url: 'http://localhost:3030/Spot/query?query='+query+'&'+output
      };
      var result = [];

      //callback function
      function callback(callback_data){
        return callback_data;
      }

      //open I/O send data to fuseki2
      request(options, function(error, response , body){
        if(!error && response.statusCode == 200){//no HTTP error case
          result = body;
          result = callback(result);
          console.log("Fuseki2 result: \n"+result);//debug response from fuseki2
        }
        else{//HTTP Error
          console.log("HTTP Error: "+response.statusCode);//debug HTTP error code
          console.log("Fuseki2 result: "+body);//debug error result from fuseki2
        }

        return res.view({
          result: result
        });//end show view
      });//end request method

    }//enf if post
  },//end function (controller action)

  AddSpot : function (){

  },

  //this is function for test form by using sails


  //this is function for testing FB API(not relative with research project)
  FbMessage: function (req,res){

    var login = require("facebook-chat-api");
    var fb_email = "";
    var fb_password = "";

    // Create simple echo bot
    login({email: "", password: ""}, function callback (err, api) {
      if(err) return console.error(err);

      /*
      var yourID = 772475315;
      var msg = {body: "Hey!"};
      api.sendMessage(msg, yourID);
      */

      // Simple echo bot. He'll repeat anything that you say.
      // Will stop when you say '/stop'
      api.setOptions({listenEvents: true});

      var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.thread_id);
              return stopListening();
            }
            api.markAsRead(event.thread_id, function(err) {
              if(err) console.log(err);
            });
            api.sendMessage("TEST BOT: " + event.body, event.thread_id);
            break;
          case "event":
            console.log(event);
            break;
        }
      });//end stopListening


    });//end FB api

    return res.view();
  },

  ServerSide: function (req, res) {

    //var request = require('request');
    var options = {
      url: 'http://localhost:3030/Jena-Tutorial-persistent/query?query=SELECT ?s ?p ?o\n' // \n は改行を表す
      + 'WHERE {?s ?p ?o}&output=json',
      //query: 'SELECT ?s ?p ?o\n' // \n は改行を表す
      //+ 'WHERE {?s ?p ?o}',
      //output: 'json',
      //method: "GET"


    };
    var json;
    //callback function
    function check(json){
      return json;
    }

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        var json_data = body;
       json = check(json_data);//callback function

      } else {
        console.log('Error');
      }
      return res.view({
        test: "test55",
        json_result: json
      });

    });


    console.log('Server SIDE done');

    //var json = check();
  /*
    return res.view({
      test: "test55",
      json_result: json
    });
  */
  }//end ServerSide function



};//end module exprot
