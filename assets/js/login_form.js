/**
 * Created by Varit on 3/4/17.
 */

/*
* feature: duel with transfer the data of login form
* */
function loginSubmit() {
  $('form#login').submit(function (event) {

    event.preventDefault();

    //this is the input of the method
    //in this case $('form#login') is the input and this will be $('form#login')
    var $login_form = $(this),
      username = $login_form.find('input#username').val(),
      password = $login_form.find('input#pwd').val(),
      url = $login_form.attr('action'),
      get_data = {username:username, password: password};

    //tomorrow we will try to make detect error by use a err_code
    $.get(url, get_data, function (data) {

      var user_id = data.user_id,
        err_code = data.err_code,
        chat_url = "/Chat/Chatbox?user_id=",
        login_url = "/User/Login?err_code=";

      console.log("[confirm server value] user_id:", user_id);

      sessionStorage.setItem('user_id', data);
      window.location.replace(chat_url + data.user_id);


    });//end get method

  });//end submit method
}//end func

promise
  .then(loginSubmit)
  .catch(onRejected);


