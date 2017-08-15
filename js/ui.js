
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

  pause = true;
}

function menuclose() {
  $("#gamemenu").hide();

  pause = false;
}


function bagopen() {
  $("#gamehook").addClass("blur");
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#bagmenu").show();
}

function bagclose() {
  $("#gamehook").removeClass("blur");
  $("#menubutton").show();
  $("#bagbutton").hide();
  $("#gamemenu").show();
  $("#bagmenu").hide();
}

function pkdexopen() {
  $("#gamehook").addClass("blur");
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#pokedex").show();
}

function pkdexclose() {
  $("#gamehook").removeClass("blur");
  $("#menubutton").show();
  $("#bagbutton").hide();
  $("#gamemenu").show();
  $("#pokedex").hide();
}

function partyopen() {
  $("#gamehook").addClass("blur");
  $("#menubutton").hide();
  $("#bagbutton").show();
  $("#gamemenu").hide();
  $("#partymenu").show();
}

function partyclose() {
  $("#gamehook").removeClass("blur");
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



function create_dialog(data){
    var dlg, id, html, buttons, button;

    id = "dialog_id_" + (new Date()).getTime();
    dlg = $("<div id='"+id+"' class='blankslate' style='width:80%; left: 0; right:0; margin:auto;position:absolute; top:10%;z-index:9999999;'</div>");

    if (data.title !== undefined) {
        $("<h3 >"+data.title+"</h3>").appendTo(dlg);
    }
    if (data.content !== undefined) {
        $("<div class='dialog-content'>"+data.content+"</div>").appendTo(dlg);
    }
    if (data.actions !== undefined && typeof data.actions == 'object') {

        buttons = $("<div class='docs-example clearfix'></div>").appendTo(dlg);

        $.each(data.actions, function(){
            var item = this;

            button = $("<a>").attr("type", "button").addClass("btn").html(item.title);

            if (item.cls !== undefined) {
                button.addClass(item.cls);
            }

            button.appendTo(buttons);

            if (item.onclick != undefined) {

                button[0].addEventListener("click", function(){
                    if (typeof item.onclick === 'function') {
                        item.onclick(dlg);
                    } else {
                        if (typeof window[item.onclick] === 'function') {
                            window[item.onclick](dlg);
                        } else {
                            var result = eval("(function(){"+item.onclick+"})");
                            result.call(dlg);
                        }
                    }
                }, true);
            }
        });
    }

    dlg.appendTo($("body"));

    var dlg_options = $.extend({}, {
        show: true,
        closeAction: true,
        removeOnClose: true
    }, (data.options != undefined ? data.options : {}));

    return dlg.dialog(dlg_options);
}
