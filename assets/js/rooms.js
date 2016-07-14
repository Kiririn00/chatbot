/*
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * room.js
 * font-end handle chat room
 */

function NewRoom(){
  io.socket.post('/Room/Join',function(data){
    console.log(data);
  });
}
