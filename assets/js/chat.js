/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * Chat.js
 * font-end handle chat event
 */

function onRejected(err) { console.log(err); }
var promise = Promise.resolve();

/*
 * feature: get the component name from server
 * */
function getComponent() {

  $.get('/Chat/GetComponent', function (res) {

    var component_length = res.component.length;

    for(var i=0; i<component_length; i++){
      $('select#component').append("<option>"+res.component[i].component_name+"</option>");
    }

  });

}

/*
 * feature: send post data of add_log form to server
 * */
function postLog() {

  $('form#add_log').submit(function (event) {
    event.preventDefault();

    var $add_log_form = $(this),
      question = $add_log_form.find('input#question').val(),
      answer = $add_log_form.find('input#answer').val(),
      component = $add_log_form.find('select#component').val(),
      url = $add_log_form.attr('action'),
      post_data = {question: question, answer: answer, component: component};

    $.post(url,post_data,function () {
      alert("record added");
      $add_log_form.val('');
    });

  });
}

/*
* feature: reset the web storage
* */
function resetProgress(address, fn) {

    $('button#reset_progress').click(function () {
      //alert("reset progressed");
      sessionStorage.clear();

      console.log(fn);
      fn("Pass value");

    });

}

resetProgress("address", function (value) {
  console.log(value);
});

/*
 * feature: confirm conversation progress
 * parameter:
 *  1.) string -> user's input message
 *  2.) array -> component_id of return message from server
 * return:
 *  integer -> progress number
 * */
function conversationProgress() {

    var process_counter = sessionStorage.getItem('process_counter');

    if (process_counter == "undefined" || process_counter == null) {
      sessionStorage.setItem('process_counter', 1);
    }
    else if (process_counter >= 1) {
          process_counter++;
          sessionStorage.setItem('process_counter', process_counter);
    }

  return sessionStorage.getItem('process_counter');

}

/*
* feature: control conversation between user and bot
* logic:
*   1.) start conversation when submit event is activate
*   2.) show user message when user submit
*   3.) get bot conversation from server
* */
function doConversation() {

  io.socket.on('connect', function () {

    $('form#send_message').submit(function (event) {

      event.preventDefault();

      var $text = $('#chat-textarea'),
        $send_message_form = $(this),
        progress_counter = 0,
        msg = $text.val(),
        get_data = {
          msg: msg,
          feedback_switch: 0,
          user_id: $send_message_form.find('input#user_id').val()
        };

      $text.val('');//clear textarea

      //popup message that user input
      $(".chat").append(
        //text is detail that user input
        '<p class="them"> ' + msg + '</p>'
      );

      io.socket.get('/Chat/TalkSession', get_data, function (data) {

        progress_counter = conversationProgress();

        $(".chat").append(
          //text is detail that bot response
          '<p id="process" class="me"> ' + data.answer + '</p>'
        );

      });//end io get

    });//end check submit event

  });//end socket.on connect

}


promise
  .then(resetProgress)
  .then(getComponent)
  .then(doConversation)
  .then(postLog)
  .catch(onRejected);



