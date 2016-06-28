/**
 * Created by ASAWAVETVUTT VARIT on 2016/05/09.
 */
//this is script
/*-------------search system--------------------------------------------------*/
//active whem click submit in search form
$("form#search").submit(function(event){
  //alert("Debug: Submit Button already put.");

  event.preventDefault();//make submit event ignore normal form submit

  var $form = $( this),//this is 'form#search'
    type = $form.find( "select[name='type']" ).val(),//get value
    category = $form.find( "select[name='category']" ).val(),
    good_for = $form.find( "select[name='good_for']" ).val(),
    url = $form.attr( "action" );//get action value from form

  //debug name and action
  console.log("Debug: form action to: "+url);
  console.log("Debug: what value of name will send:"+type);
  console.log("Debug: what value of name will send:"+category);
  console.log("Debug: what value of name will send:"+good_for);

  //require and response data
  $.post(//use jQuery post for send post data
    url,//set url for post
    { type: type, category: category, good_for: good_for },//set data to post
    function(data){//create function after post will get data

      var content = JSON.parse(data.result);//get value of result and make json to string
      var content_length = content.results.bindings.length;//count number of content
      var items = [];//create array items for save all of content

      console.log("Debug:number of content is: "+content_length);//debug length of content

      for(var i=0;i<content_length;i++){//loop by content length
        items[i] = content.results.bindings[i].spotname.value;//save content to array
        $("div#count").empty().append(i+1);//show newest's count number at div id count
      }

      //show content at <div id='result'>
      $( "div#result").empty().append("<a id='linkdata' href='#'> "+items.join("<br/>")+"</a>");

      console.log("Debug:"+"<br/>"+data.result);//debug show get json form server
    }//end $.post function
  );//end $("form#search")

});//end form submit event
/*-------------search system-----------------------------------------------------------*/
