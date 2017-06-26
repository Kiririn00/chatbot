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
            or: [
              {username: username_view},
              {password: password_view}
            ]
          }
        };

      function passport() {
        //login check
        User.find(user_query).exec(function find(err, found) {

          if(err){console.log(err);}
          console.log(found);

          if (found.length == 0) {//login failed
            return res.json({user_id: "not found"});
          }
          else if (found.length > 0) {
            return res.json({user_id: found[0].user_id});
          }
          else {
            return res.json({user_id: "error"});
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

  },

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
