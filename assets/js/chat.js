/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * Chat.js
 * font-ent handle chat event
 */

function InsertMessage(msg){
  io.socket.post('/Room/BroadcastMessage',{msg: msg},function(data){
    console.log(data.message);
  });
}

function SendMessage() {

  //get id chat-textarea
  var $text = $('#chat-textarea');
  //put value of text area to variable name msg
  var msg = $text.val();

  InsertMessage(msg);

  $text.val('');//clear textarea

}

//pass model value parameter for delete all
//data in model.
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

