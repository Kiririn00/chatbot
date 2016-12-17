/**
 * Created by Varit on 11/16/16.
 */

/*-------------- auto fill preference's name-------------*/

$.get('/Experiment/PreferenceName', function (data) {

  var preference_name_num = data.preference_name.length;

  for(var i=0;i<preference_name_num;i++) {

    //console.log(data.preference_name[i]);

    document.getElementById('preference_name'+i).innerHTML = data.preference_name[i];

  }

});

/*------------- end auto fill preference's name---------*/

/*--------------random number by 1 loop----------------*/

function randomNumbers(array) {

  var current_index = array.length,
      temporary_value,
      random_index;

  while (0 != current_index){

    /* random index of array
    * random_index will save the variable of index of array
    * example current_index is 10. random_index can be a 1-9
    * can't be 10. Because Math.random will random number around
    * 0~0.9 will not be 1. So this is perfect way to random index of array.
    * */
    random_index = Math.floor(Math.random() * current_index);
    current_index--;//When it random index mean it shuffle 1 time. So minus 1 index

    //move current index(max index in that loop time) to temporary
    temporary_value = array[current_index];
    //change the current index to random index
    //At this point index of array was shuffled.
    array[current_index] = array[random_index];
    array[random_index] = temporary_value;

  }

  console.log("random array: ",array);

}

/*-------------end function random number---------------*/

/*-------------- auto fill input number------------------*/
$('input#auto_fill').click(function (event) {

  function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function fillForm(random_num){

    for(var i=0;i<random_num.length;i++) {
      document.getElementById('preference'+i).value = random_num[i];
    }
  }

  var random_num = [1,2,3,4,5,6,7,8,9,10];

  random_num = shuffleArray(random_num);

  fillForm(random_num);

  randomNumbers(random_num);

});

/*--------------end auto fill input number-------------*/


