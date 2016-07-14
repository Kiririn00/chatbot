/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/21.
 *
 * app.js
 *Front-end code and event handling for charbot
 */

io.socket.on('connect', function() {// if web socket online

  //wait for broadcast message
  io.socket.on('message', function (data){
    console.log("broadcast: "+data.msg);

    $(".chat").append(
      //text is detail that user input
      '<p class="them"> ' +data.msg + '</p>'
    );

    $.get('/Chat/TalkSession',{msg: data.msg},function (data){

    });
  });

  NewRoom();

  UpdateMessage();

  $('#chat-send-button').click(SendMessage);

  $('div#clear_message').click({model:"Chat"},RemoveSocketData);

  $('div#clear_room').click({model:"Room"},RemoveSocketData);

  // When the socket disconnects, hide the UI until we reconnect.
  io.socket.on('disconnect', function() {

    console.log("socket disconnect");

  });
});//end listen socket

