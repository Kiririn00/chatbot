/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/21.
 *
 * This script is for connect web socket and make chat bot
 *
 */

var socket = window.io.connect();//open web socket
var items = [];

socket.on('connect', function() {// if web socket online

  io.socket.get("/text", function(messages) {//get text event
    for (var i = 0; i < messages.length; i++) {//count array length forloop
      $(".chat").append(
        '<p class="them"> ' +messages[i].text + '</p>'+//text is detail that user input
        '<p class="me"> ' +messages[i].bot + '</p>'// bot is response from bot engine
      );
    }
  });


  io.socket.on('text', function(message) {//wait for text event
    console.log(message);//debug in case text event come, and print what it come (event will come if we post)
    //if(message.verb == "created") {
      $(".chat").append(
        '<p class="them">' + message.data.text + '</p>'+
        '<p class="me">' + message.data.bot + '</p>'
      );
    //}
  });

});

//-------------------- end socket connect-----------------------------------------------------------------//

//if send button is push
$('#chat-send-button').on('click', function() {


  var $text = $('#chat-textarea');//get id chat-textarea

  var msg = $text.val();//put value of text area to variable name msg
  $text.val('');//clear textarea

  //just for test chat message if Hello will return Good Morning other that wil return don'nt knoe
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

//----------------------------------------------end on click send system -------------------------------------//

//----------------------------------------------clear log system --------------------------------------------//
$('div#clear').on('click', function () {//on click clear button

  $.getJSON('/text',function(data){//get json from /text

    $.each(data, function(key,value){//split them
      console.log(value.id);//debug id of json
      /*
      * each time that read id it will send to deleteMessage
      * function for delete it one by one
      * */
      deleteMessage(value.id);
    });

  });

  function deleteMessage(id) {

     // for (var i = 127; i < 135; i++) {
        io.socket.delete('/text/' + id, function (resData) {//delete by if
          console.log(resData);
          resData; // => {id:9, name: 'Timmy Mendez', occupation: 'psychic'}
        });
      //}

  }

});
