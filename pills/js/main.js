// JS Defaults
$(document).ready(function(){

  // Load Tina
  var tina1  = new Audia("sounds/Tina1.mp3");
  var tina2  = new Audia("sounds/Tina2.mp3");
  var tina3  = new Audia("sounds/Tina3.mp3");

  // Load Kingston
  var kingston1  = new Audia("sounds/Kingston1.mp3");
  var kingston2  = new Audia("sounds/Kingston2.mp3");
  var kingston3  = new Audia("sounds/Kingston3.mp3");

  // Load Siri
  var siri1  = new Audia("sounds/Siri1.mp3");
  var siri2  = new Audia("sounds/Siri2.mp3");
  var siri3  = new Audia("sounds/Siri3.mp3");

  var startVolume = $('#load-pulsate').data('volume');
  var volumeUp = startVolume + 8;

  var trackClick = 1;

  $('#load-pulsate').delay(900).addClass('animated pulse');
  $('#load-kingston').delay(900).addClass('animated pulse');
	$('#hi-tina, #hi-luke, #hi-kingston, #hi-otis, #hi-trek, #hi-mikey, #buy-a-pill').on({
    'mouseover': function(){$(this).addClass('active')},
    'mouseout' : function(){$(this).removeClass('active')}
  });
  $('#load-pulsate').on('click', function(){
                     if(trackClick == 1){
                        tina1.play();
                        tina2.volume = Number(3);
                          if(tina2.playing){
                            tina2.stop();
                          }
                          $('#load-blurb').delay(800).addClass('animated bounceIn').css('display','block');
                        }else if(trackClick == 2){
                          tina2.play();
                          tina2.volume = Number(6);
                            if(tina1.playing){
                              tina1.stop();
                            }
                            $('#load-blurb').addClass('bounceOut');
                            $('#load-blurb-loud1').addClass('animated bounceIn').css('display','block');
                        }
                        else if(trackClick == 3){
                          tina3.play();
                          tina3.volume = Number(9);
                            if(tina2.playing){
                              tina2.stop();
                            }
                            $('#load-blurb-loud1').addClass('bounceOut');
                            $('#load-blurb-loud2').addClass('animated bounceIn').css('display','block');
                        }
                        trackClick++;
  });
  $('#load-kingston').on('click',function(){
    kingston1.play();
    kingston1.volume = Number(3);
    siri1.volume = Number(3);
    $('#load-blurb').delay(800).addClass('animated bounceIn').css('display','block');

    if(kingston1.playing){
      setTimeout(function(){
        siri1.play();
      },4002);
    }
      setTimeout(function(){
        kingston2.play();
      },11002);
      setTimeout(function(){
        siri2.play();
      },16002);
      setTimeout(function(){
        kingston3.play();
      },20002);
      setTimeout(function(){
        siri3.play();
      },23002);
  });
});