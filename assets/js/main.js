/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/21.
// Socket.IOに接続
 */
var socket = window.io.connect();
var num;

socket.on('connect', function() {

  io.socket.get("/text", function(messages) {
    for (var i = 0; i < messages.length; i++) {
      $(".chat").append( '<p class="them"> ' +messages[i].text + '</p>');

      $(".chat").append( '<p class="me"> ' +messages[i].bot + '</p>');

    }
  });

  io.socket.on('text', function(message) {

    console.log(message);
    if(message.verb == "created") {
      $(".chat").append(
        '<p class="them">' + message.data.text + '</p>'+
        '<p class="me">' + message.data.bot + '</p>'
      );
    }
  });

});

$('#chat-send-button').on('click', function() {
  var $text = $('#chat-textarea');

  var msg = $text.val();
  $text.val('');

  if(msg != "Hello")
  {
    io.socket.post("/text",
      {
        text: msg,
        bot: "not understand"
      },function(res){

        $(".chat").append(
          '<p class="them">' + res.text + '</p>' +
          '<p class="me">' + res.bot + '</p>'
        );

      });

  }

    else if(msg == "Hello")
      {
        io.socket.post("/text",
          {
            text: msg,
            bot: "Good Morning"
          },
          function(res){
            $(".chat").append(
              '<p class="them">' + res.text + '</p>' +
              '<p class="me">' + res.bot + '</p>'
            );
          }
        );
      }
  });



$('div#clear').on('click', function(){
  console.log("click");

  for(var i=127;i<135;i++) {
    io.socket.delete('/text/'+i, function (resData) {
      console.log(resData);
      resData; // => {id:9, name: 'Timmy Mendez', occupation: 'psychic'}
    });
  }


});

