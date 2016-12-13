/**
 * Created by Varit on 11/16/16.
 */



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

});

/*--------------end auto fill input number-------------*/
