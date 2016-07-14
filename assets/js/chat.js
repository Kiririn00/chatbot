/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * Chat.js
 * font-ent handle chat event
 */


function UpdateMessage(room_id){


  //get text event
  io.socket.get("/chat?room_id="+room_id, function(messages) {
    //count array length forloop
    for (var i = 0; i < messages.length; i++) {
      $(".chat").append(
        //text is detail that user input
        '<p class="them"> ' +messages[i].text + '</p>'+
          // bot is response from bot engine
        '<p class="me"> ' +messages[i].bot + '</p>'
      );
    }
  });

  //wait for text event
  io.socket.on("/chat?room_id="+room_id, function(message) {
    //debug in case text event come,
    //and print what it come (event will come if we post)
    console.log(message);
    //if(message.verb == "created") {
    $(".chat").append(
      '<p class="them">' + message.data.text + '</p>'+
      '<p class="me">' + message.data.bot + '</p>'
    );
  });

}

function InsertMessage(msg){
  io.socket.post('/Room/BroadcastMessage',{msg: msg},function(data){
    console.log(data.message);
  });
}

function SendMessage(){

  //get id chat-textarea
  var $text = $('#chat-textarea');
  //put value of text area to variable name msg
  var msg = $text.val();

  InsertMessage(msg);

  $text.val('');//clear textarea

  /*
  $.get('/Chat/TalkSession', {
        msg: msg
    }
  );
  */

  /*
  $.getJSON('/Chat/StopSentence',function(data){//get json from about chat log
      var count = 0;//create variable count for be a parameter when loop
      $.each(data, function(key,value){//split data from json
        console.log(value);//debug value from split
        var length = value.length;// save number of length for what times will loop
        bot_answer(value,length,count,msg);//send all of value to function bot_answer
      });

  });//end getJSON
*/
}

/*
 * this function purpose is for answer question from user
 * the answer and question data will contain in JSON form
 *
 * function bot_answer(<value from split JSON in array>,<number of json data>,<loop times's number>)
 *
 */
  /*
function bot_answer(value,length,count,msg)
{
    $.getJSON('/room', function (data) {

      var room = data[data.length - 1];
      console.log("Room id: " + room.id);
      UpdateMessage(room.id);




    console.log(value[count].question);//debug show all texts question
    for (var i = 0; i < length; i++)//loop by number of array data
    {
      if (msg == value[count].question) {//if question from textarea is match in array then answer by parameter of loop
        io.socket.post("/chat/",
          {
            text: msg,//value from textare to text field
            bot: value[count].answer, //add answer to bot field
            room_id: room.id
          }
        );
        break;//if user's question match question in DB so that all done noting to do brake from loop now
      }//end if
      else if (count + 1 == length) {// this else if for case that any data of array question don't match
        io.socket.post("/chat",
          {
            text: msg,
            bot: "Not Understand",
            room_id: room.id
          }
        );
      }
      else {//count value will increase 1 every time that question not match or every loop not done
        count++;
      }
    }
    console.log(count);//debug count that all of loop is done?
    });
}
*/

function RemoveSocketData(event){
  var model = event.data.model;
  var id;
  $.getJSON('/'+model,function(data){//get json from /text

      $.each(data, function(key,value){//split them
        console.log(value.id);//debug id of json
        id = value.id;
        io.socket.delete('/'+model+'/' + id, function (resData) {//delete by if
          console.log(resData);
          resData;
        });

      });

  });

}

