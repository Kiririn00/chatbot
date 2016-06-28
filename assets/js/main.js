/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/21.
 *
 * This script is for connect web socket and make chat bot
 *
 */

var socket = window.io.connect();//open web socket
var items = [];

socket.on('connect', function() {// if web socket online

  io.socket.get("/chat", function(messages) {//get text event
    for (var i = 0; i < messages.length; i++) {//count array length forloop
      $(".chat").append(
        '<p class="them"> ' +messages[i].text + '</p>'+//text is detail that user input
        '<p class="me"> ' +messages[i].bot + '</p>'// bot is response from bot engine
      );
    }
  });

  io.socket.on('chat', function(message) {//wait for text event
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
$('#chat-send-button').on('click', function () {

    /*
    This getJSON purpose is for get all of bot answer and question pattern.
    and this function will use json(parameter name "data") to split to ket and value
    of JSON. But we will just use about value. After that we will count number of data
    in JSON and all of value. And we will send all of them to other function

    $.getJSON(<chatbot pattern JSON file URL>)

     */
    $.getJSON('/Chat/StopSentence',function(data){//get json from about chat log
      var count = 0;//create variable count for be a parameter when loop
      $.each(data, function(key,value){//split data from json
        console.log(value);//debug value from split
        var length = value.length;// save number of length for what times will loop
        bot_answer(value,length,count);//send all of value to function bot_answer
      });
    });
  /*
  * this function purpose is for answer question from user
  * the answer and question data will contain in JSON form
  *
  * function bot_answer(<value from split JSON in array>,<number of json data>,<loop times's number>)
  * */
  function bot_answer(value,length,count)
  {

    var $text = $('#chat-textarea');//get id chat-textarea
    var msg = $text.val();//put value of text area to variable name msg
    $text.val('');//clear textarea


    console.log(value[count].question);//debug show all texts question
    for(var i=0;i<length;i++)//loop by number of array data
    {
      if (msg == value[count].question) {//if question from textarea is match in array then answer by parameter of loop
        io.socket.post("/chat",
          {
            text: msg,//value from textare to text field
            bot: value[count].answer //add answer to bot field
          },
          function (res) {//after post to socket them show text and bot data(DOM changed)
            $(".chat").append(
              '<p class="them">' + res.text + '</p>' +
              '<p class="me">' + res.bot + '</p>'
            );
          }
        );
        break;//if user's question match question in DB so that all done noting to do brake from loop now
      }//end if
      else if (count+1 == length) {// this else if for case that any data of array question don't match
        io.socket.post("/chat",
          {
            text: msg,
            bot: "Not Understand"
          },
          function (res) {
            $(".chat").append(
              '<p class="them">' + res.text + '</p>' +
              '<p class="me">' + res.bot + '</p>'
            );
          }
        );
      }
      else {//count value will increase 1 every time that question not match or every loop not done
        count++;
      }
    }
    console.log(count);//debug count that all of loop is done? 
  }//end function
});//end on click

//----------------------------------------------end on click send system -------------------------------------//

//----------------------------------------------clear log system --------------------------------------------//
$('div#clear').on('click', function () {//on click clear button

  $.getJSON('/chat',function(data){//get json from /text

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
        io.socket.delete('/chat/' + id, function (resData) {//delete by if
          console.log(resData);
          resData; // => {id:9, name: 'Timmy Mendez', occupation: 'psychic'}
        });
      //}

  }

});

