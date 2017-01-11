/**
 * Created by ASAWAVETVUTT VARIT on 2016/05/09.
 */

/*------------ ignore reload script---------*/

$('form#ignore_reload').submit(function (event) {
  event.preventDefault();
});

/*------------- ignore reload script -------:/

/*-------------search system--------------------------------------------------*/
//active whem click submit in search form
$("form#search").submit(function(event){
  //alert("Debug: Submit Button already put.");

  event.preventDefault();//make submit event ignore normal form submit

  var $search_form = $( this),//this is 'form#search'
    type = $search_form.find( "select[name='type']" ).val(),//get value
    category = $search_form.find( "select[name='category']" ).val(),
    good_for = $search_form.find( "select[name='good_for']" ).val(),
    url = $search_form.attr( "action" );//get action value from form

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

/*-------- spot preference form's script ----------*/
$('form#experiment').submit(function (event) {

  var user_preference = [];
  //ignore normal form submit
  event.preventDefault();

  //get all value from of form
  var $experiment_form = $(this),
    preference_number = $experiment_form.find('input#preference_number').val(),
    feedback = $experiment_form.find('select[id="feedback"]').val(),
    url = $experiment_form.attr('action');

  for(var i=0;i<preference_number;i++){
    user_preference[i] = $experiment_form.find('input#preference'+i).val();
  }

  //debug: check send form value
  console.log(user_preference);
  console.log("Debug feedback: "+JSON.stringify(feedback));
  console.log("Debug action to: "+url);

  $.post(url,
    {'user_preference[]':JSON.stringify(user_preference),feedback:feedback,
      preference_number:preference_number},
    function (preference){

      var spot_name = preference.response[0].spot_name;
      var cosine_degree = preference.response[0].cosine_degree;

      $('td#spot_name').text(spot_name);
      $('td#cosine_degree').text(cosine_degree);

    }

  );

});
/* ------------ END spot preference form's script  -----------*/

/*-------------- add new preference form's script--------------------*/

$('form#add_preference').submit(function (event) {

  event.preventDefault();

  var add_preference = $('input#add_preference').val();
  var url = $('form#add_preference').attr('action');

  $.post(url,{add_preference: add_preference},function (data) {

    //may be no response data. I don't sure.

  });

});

/*-------------- END add new preference form's script--------------------*/


