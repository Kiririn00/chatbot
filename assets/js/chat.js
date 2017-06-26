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
        feedback_switch = $send_message_form.find('input#activate-feedback-component:checked').val(),
        feedback_mode_activate = $send_message_form.find('input#feedback_mode:checked').val(),
        feedback_mode_non_activate = $send_message_form.find('input#feedback_mode:not(:checked)').val(),
        feedback_mode,
        msg = $text.val(),
        table_highlight_counter = 0;

      if(feedback_mode_activate == 1){
        feedback_mode = 1;
      }
      else if(feedback_mode_non_activate == 1){
        feedback_mode = 0;
      }

      var get_data = {
          msg: msg,
          feedback_switch: feedback_switch,
          feedback_mode: feedback_mode,
          user_id: $send_message_form.find('input#user_id').val()
        };

        console.log("feedback_mode: ", feedback_mode);

      $text.val('');//clear textarea

      //popup message that user input
      $(".chat").append(
        //text is detail that user input
        '<div class="alert alert-success text-right"> ' + msg + '</div>'
      );

      io.socket.get('/Chat/TalkSession', get_data, function (data) {

        console.log("data from server: ", data);

        progress_counter = conversationProgress();

        //print result from recommendation from server
        $(".chat").append(
          //text is detail that bot response
          '<div id="process" class="alert alert-warning"> ' + data.answer + '</div>'
        );

        //print current top label
        if(data.current_conversation[data.current_conversation.length -1].component_id == 2) {
          $('span#top_label_id').append(data.top_label.label_id.toString());
          $('span#top_label_name').append(data.top_label.label_name.toString());
        }

        //print debug data on the table

        try {
          for (var i = 0; i < data.spot_vector.length; i++) {

            if(i==0) {
              $('tbody#debug_log').append(
                '<tr class="table-success">' +
                '<th scope="row">' + (i + 1) + '</th>' +//number of row
                '<td >' + data.spot_id[i] + '</td>' +//spot id
                '<td >' + data.spot_name[0][i].spot_name + '</td>' +//spot id
                '<td >' + data.user_vector + '</td>' +//user vector
                '<td >' + data.spot_vector[i] + '</td>' +//spot vector
                '<td >' + data.cosine_degree[i] + '</td>' +
                '</tr>'
              );
            }
            else{
              $('tbody#debug_log').append(
                '<tr>' +
                '<th scope="row">' + (i + 1) + '</th>' +//number of row
                '<td>' + data.spot_id[i] + '</td>' +//spot id
                '<td >' + data.spot_name[0][i].spot_name + '</td>' +//spot id
                '<td>' + data.user_vector + '</td>' +//user vector
                '<td>' + data.spot_vector[i] + '</td>' +//spot vector
                '<td>' + data.cosine_degree[i] + '</td>' +
                '</tr>'
              );
            }
          }
        }
        catch(error){
          console.log("still not calculate", error);
        }


        if(data.feedback_question != null){// if bot ask for feedback

          $send_message_form.find('input#activate-feedback-component').prop('checked', true);

          $(".chat").append(
            //text is detail that bot response
            '<p id="process" class="alert alert-warning"> ' + data.feedback_question + '</p>'
          );
        }

      });//end io get

      if (feedback_switch == 1){//when feedback checkbox is checked.
        $send_message_form.find('input#activate-feedback-component').prop('checked', false);
      }

    });//end check submit event

  });//end socket.on connect

}


promise
  .then(resetProgress)
  .then(getComponent)
  .then(doConversation)
  .then(postLog)
  .catch(onRejected);



