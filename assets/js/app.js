/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/21.
 *
 * app.js
 * Front-end
 * handle all feature in client.
 * Mainly call functions in app.js will mean
 * to execute feature. It should mainly call function
 * not coding algorithm.
 */

io.socket.on('connect', function() {// if web socket online

  //wait for broadcast message
  io.socket.on('message', function (data){
    console.log("broadcast: "+data.msg);

    $(".chat").append(
      //text is detail that user input
      '<p class="them"> ' +data.msg + '</p>'
    );

    $.get('/Chat/TalkSession',{msg: data.msg, feedback_switch: data.feedback_switch},function (data){

      $(".chat").append(
        //text is detail that bot response
        '<p class="me"> ' +data.answer + '</p>'
      );

    });
  });

  //make new room when page load
  NewRoom();

  //request to broadcast to room when send messages.
  $('#chat-send-button').click(SendMessage);

  $('#reset-score-button').click(ResetScore);

  // When the socket disconnects
  io.socket.on('disconnect', function() {

    console.log("socket disconnect");

  });

});

