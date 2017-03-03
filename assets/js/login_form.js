/**
 * Created by Varit on 3/4/17.
 */

/*
* feature: duel with transfer the data of login form
* */

function loginSubmit() {
  $('form#login').submit(function (event) {

    event.preventDefault();

    var $login_form = $(this),
      username = $login_form.find('input#username').val(),
      password = $login_form.find('input#pwd').val(),
      url = $login_form.attr('action'),
      get_data = {username:username, password: password},
      user_id;

    $.get(url, get_data, function (data) {
      console.log("return data: ", data.user_id);
      sessionStorage.setItem('user_id', data);

      window.location.replace("/Chat/Chatbox?user_id="+data.user_id);
    });

  });
}//end func

promise
  .then(loginSubmit)
  .catch(onRejected);


