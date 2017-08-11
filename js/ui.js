
function populatebag() {
  $("#baglist").empty();
  for (i = 0; i < bag.length; i++) {
    if (bag[i] != 0) {
      bagadditem(bag[i]);
    }
  }
}

function bagadditem(id) {

    var array = dbitem[id].m.split(',');
    v = id;
    if (id < 10) {
      v = "00" + id;
    }
    if ((id < 100) && (id >= 10)) {
      v = "0" + id
    }
    var div = "<div class='list' ><img data-role='fitImage' src='assets/icon/item" + v + ".png' class='list-icon'> <span class='list-title'>" + array[1] + "</span> </div>"
    $(div).appendTo("#baglist");

}

function populateparty() {
  $("#partylist").empty();
  for (i = 0; i < party.length; i++) {
    if (party[i].number != 0) {
      v = party[i].number;
      if (party[i].number < 10) {
        v = "00" + party[i].number;
      }
      if ((party[i].number < 100) && (party[i].number >= 10)) {
        v = "0" + party[i].number
      }
      var div = "<div style='background: #008CFF; color:#FFF;' class='tile' onclick='' data-role='tile'><div class='tile-content'><span class='tile-label'>" + party[i].name + " " + party[i].ps + "/" + party[i].psm + " L. " + party[i].level + "</span><img class =''src='assets/pokemon/" + v + ".gif'></div></div>";
      $(div).appendTo("#partylist");
    }
  }
}


function menuopen() {
  $("#gamemenu").show();
  $("#gamehook").addClass("blur");
  pause = true;
}

function menuclose() {
  $("#gamemenu").hide();
  $("#gamehook").removeClass("blur");
  pause = false;
}


function bagopen() {
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#bagmenu").show();
}

function bagclose() {
  $("#menubutton").show();
  $("#bagbutton").hide();
  $("#gamemenu").show();
  $("#bagmenu").hide();
}

function pkdexopen() {
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#pokedex").show();
}

function pkdexclose() {
  $("#menubutton").show();
  $("#bagbutton").hide();
  $("#gamemenu").show();
  $("#pokedex").hide();
}

function partyopen() {
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#partymenu").show();
}

function partyclose() {
  $("#menubutton").show();
  $("#bagbutton").hide();
  $("#gamemenu").show();
  $("#partymenu").hide();
}

function hidestart() {
  $("#start").hide();
  $('#preloader').show();
}

setInterval(function(){
$("#introdiv").scrollTop(150);
},1000/60);

function introanimation(){
  $("#anitop").animate({top:150},500)
  $("#anibot").animate({bottom:150},500)
  setTimeout(function(){
  $("#anitop").animate({top:0},500)
  $("#anibot").animate({bottom:0},500)
  },2000)
}
