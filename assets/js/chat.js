/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * chat.js
 * font-end handle chat event
 */

function onRejected(err) { console.log(err); }
var promise = Promise.resolve();

function sendMessage() {

  $('form#send_message').submit(function (event) {

    event.preventDefault();

    var $text = $('#chat-textarea');
    msg = $text.val();

    //popup message that user input
    $(".chat").append(
      //text is detail that user input
      '<p class="them"> ' + msg + '</p>'
    );

    $.get('/Chat/TalkSession', {msg: msg, feedback_switch: 0}, function (data) {
      $(".chat").append(
        //text is detail that bot response
        '<p class="me"> ' + data.answer + '</p>'
      );
    });

    $text.val('');//clear textarea

  });
}

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

promise
  .then(getComponent)
  .then(sendMessage)
  .then(postLog)
  .catch(onRejected);


