

function joystick(zone){
  joy_deg = 46;
  joy_mouse = {
    left : 0,top : 0
  }

  joy_bodyset = false;
  joy_stickhandler = false;
  this.start = function()
  {
  $(zone).on("touchstart",function(e){
    e.preventDefault();
      var joy_touch = e.touches[0];
      joy_mouse.left = joy_touch.pageX - $(document).scrollLeft() - $('body').offset().left
      joy_mouse.top = joy_touch.pageY - $(document).scrollTop() - $('body').offset().top
      console.log(mouse.left +  " " + mouse.top)
    })
   $(zone).on("touchstart mousedown",mousedownhandler)
   $(zone).on("touchend mouseup",mouseuphandler)
  }
  this.pause = function()
  {
  $(zone).off("mousedown",mousedownhandler);
  $(zone).off("mouseup",mouseuphandler);

  $(zone).off("touchstart",mousedownhandler)
  $(zone).off("touchend",mouseuphandler)
  clearInterval(refresh);
  }
  this.deg = function(){
    return joy_deg;
  }
  this.distance = function(){ return joy_distance;
  }
  this.deltaX = function(){
    return Math.abs(joy_abs.x -  parseInt($(".joy").css("left"))-25)
  }
  this.deltaY = function(){
    return Math.abs(joy_abs.x -  parseInt($(".joy").css("left"))-25)
  }
  $('body').on("mousemove",function(e) {
    joy_mouse.left = e.pageX - $(document).scrollLeft() - $('body').offset().left
    joy_mouse.top = e.pageY - $(document).scrollTop() - $('body').offset().top
    if (joy_stickhandler) {definestick(joy_mouse.left,joy_mouse.top);}
  });

  document.addEventListener('touchmove', function(e) {

      var joy_touch = e.touches[0];
      joy_mouse.left = joy_touch.pageX - $(document).scrollLeft() - $('body').offset().left
      joy_mouse.top = joy_touch.pageY - $(document).scrollTop() - $('body').offset().top
        if (joy_stickhandler) {definestick(joy_mouse.left,joy_mouse.top);}
  }, false);

  function mousedownhandler(){
    definestick(joy_mouse.left,joy_mouse.top);
    joy_stickhandler = true;
  }

  function mouseuphandler(){
    joy_abs.x = 0;
    joy_abs.y = 0;
    joy_deg = 0;

    clearInterval(joy_refresh);
    joy_bodyset = false;
    joy_stickhandler = false;
    $(".stick").fadeOut(200)
    $(".joy").fadeOut(200)
    setTimeout(function(){
      $(".stick").remove()
      $(".joy").remove()
    },200)
  }





  function definestick(left,top)
  {
    if (joy_bodyset == false){
      joy_abs = {
        x : left,
        y: top
      }
      joy_direction = "";
      joy_stick = $("<div></div>");
      joy_stick.css({
        position : "absolute" ,
      "background-color":"#c0d6d8",
      "border-radius" : "50%",
      "opacity" : "0.4",
         height:100,
         width:100,
         "left":left - 50,
         "top":top -50,
         "z-index": 9999999
      });
      joy_stick.addClass( "stick")
      joy_stick.appendTo(zone).hide().fadeIn(200);
      joy_s =  $("<div></div>");
      joy_s.css({
        position : "absolute" ,
      "background-color":"#c0d6d8",
      "opacity" : "0.4",
      "border-radius" : "50%",
         height:50,
         width:50,
         "left":left - 25,
         "top":top -25,
         "z-index": 9999999
      })
      joy_s.addClass( "joy")
      joy_s.appendTo(zone).hide().fadeIn(200);
      joy_bodyset = true;
      joy_refresh = setInterval(function(){
        if ((Math.abs(joy_abs.x -  parseInt($(".joy").css("left"))-25) > 10) && (Math.abs(joy_abs.y -  parseInt($(".joy").css("top"))-25 ) > 10 ))
        {
         if ((joy_deg <= 45) || (joy_deg > 315)) {joy_direction = "right"; $(zone).trigger("joystickright")}
         if ((joy_deg > 45)&&(joy_deg <= 135)) {joy_direction = "up";$(zone).trigger("joystickup")}
         if ((joy_deg > 135)&&(joy_deg <= 225)) {joy_direction = "left";$(zone).trigger("joystickleft")}
         if ((joy_deg > 225)&&(joy_deg <= 315)) {joy_direction = "down";$(zone).trigger("joystickdown")}
       }
       },1000/60)

       joy_deg = "";
    }else{
      joy_p1 = {
        x : 0,
        y : 0
      }
      joy_p2 = {
        x : joy_mouse.left -  parseInt($(".stick").css("left"))-50,
        y : joy_mouse.top  -  parseInt($(".stick").css("top"))-50
      }
      joy_abs = {
        x : parseInt($(".stick").css("left"))-50,
        y: parseInt($(".stick").css("top"))-50
      }
joy_Vx = joy_p2.x - joy_p1.x;
      joy_Vy = joy_p1.y - joy_p2.y;
      joy_distance = Math.sqrt( joy_Vy*joy_Vy + joy_Vx*joy_Vx )
      var joy_radians = Math.atan2(joy_Vy, joy_Vx);
      if (joy_radians < 0) joy_radians += 2*Math.PI;
      joy_deg  = joy_radians * 180/Math.PI;

      if (Math.abs(left -  parseInt($(".stick").css("left"))-50) < Math.abs(Math.cos(joy_radians)*50)){
      $(".joy").css("left",left - 25);}else{
      $(".joy").css("left",joy_abs.x + 74 + Math.cos(joy_radians)*50)
      }



      if (Math.abs(top -  parseInt($(".stick").css("top"))-50) <  Math.abs(Math.sin(joy_radians)*50)){
      $(".joy").css("top",top - 25);}else{
        $(".joy").css("top",joy_abs.y + 74 + Math.sin(joy_radians)*-50)
      }

    }


  }


}
