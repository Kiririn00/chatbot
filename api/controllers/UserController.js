/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		return res.send("Hi there!");
	},

  Login : function (req,res){

    return res.view();

  },
  //this action is for make login process
  Process: function (req,res){

      //create value, prepare for input data from mySQL
      var username_DB;
      var password_DB;
      //get post data from view
      var username_view = req.param('username');
      var password_view = req.param('password');

      //callback: get DB data
      function receive_data(){

        console.log(username_view);
        console.log(password_view);

      }//end function callback

      function redirect(){

      }

      //login check
      User.find({}).exec(function find(err, found){

        for(var i=0 ; i< found.length ; i++) { //loop for many record

          //put mySQL data record to value
          var data_result = receive_data();

          // if username and password from view are the same in mySQL
          if(username_view == found[i].username && password_view == found[i].password ) {
            console.log("Login Complete");
            return res.redirect('/Spot/Home');
          }
          else{
            console.log("Login Failed");
            //just do noting
          }//end else

        }//end for loop

        //redirect();
        return res.redirect('User/Login');
      });//end exec


  },

  Register: function (req, res) {

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

    }//end if post

    //render view
    return res.view();
  }
};
