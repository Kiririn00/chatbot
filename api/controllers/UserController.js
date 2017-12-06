/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('promise'),
  promise = Promise.resolve();

function onRejected(err) {
  console.log(err);
}

module.exports = {
	index: function (req, res) {
		return res.send("Hi there!");
	},

  Test: function (req,res) {

    String.prototype.isMatch = function(s){
      return this.match(s) !== null;
    };

    var myBool = "Ali".isMatch("Ali");

    console.log(myBool);

    return res.json();
  },

  Login : function (req,res){

	  res.locals.layout = 'login_layout';
    return res.view();

  },
  //this action is for make login process
  LoginProcess: function (req,res){

    if(req.method == "GET") {

      //get post data from view
      var username_view = req.param('username'),
        password_view = req.param('password'),
        user_query = {
          select: ['user_id'],
          where: {
              username: username_view,
              password: password_view
          }
        },
        err_login_failed_mgs = "err-user-login-001",
        err_login_other = "err-user-login-002";

      function passport() {
        //login check
        User.find(user_query).exec(function find(err, found) {

          function loginFailedMessage(err_code) {

            return res.json({
              user_id: null,
              err_code: err_code
            });
          }

          if(err){console.log(err);}
          console.log("found the user id: ", found);

          if (found.length == 0) {//login failed
            loginFailedMessage(err_login_failed_mgs);
          }
          else if (found.length > 0) {//login success
            return res.json({
              user_id: found[0].user_id
            });//return user id to client
          }
          else {//unknown case that affect to login form to failed
            loginFailedMessage(err_login_other);
          }

        });//end find
      }

      promise
        .then(passport)
        .catch(onRejected)
    }
    else{
      return res.json({user_id: "error not a GET method"});
    }

  }, //end action

  Register: function (req, res) {

    res.locals.layout = 'login_layout';

    //check if post data had request
    if(req.method=='POST') {
      //get post data from view
      var username = req.param('username');
      var password = req.param('password');
      var email = req.param('email');

      //INSERT new data to mySQL
      User.create({
        username: username,
        password: password,
        email: email
      }).exec(function CreateData(err,created){
        console.log('create data:'+ created.username);
      });

      return res.view('user/Login');

    }//end if post
    else {
      //render view
      return res.view();
    }
  }
};
