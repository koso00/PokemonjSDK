function scriptcore() {
  if (programcounter == 0)
    {
      parsescript = map.scripts[scriptid];
    }

  $("#choosehook").empty();
  $("#choosehook").hide();

  if (parsescript.line.length == programcounter) {
    console.log("end of the script");
    programcounter = 0;
    lockplayer = false;
    if (parsescript.type == "button")
    {
      setTimeout(function(){scriptflag = false ; console.log("scriptflag = false:")},500);
    }
    return false;
  }

  var pr = parsescript.line[programcounter];
  programcounter++
  if (pr.exe == "text") {
    textbox(pr.arg1);
  }

  if (pr.exe == "compare") {

    if (pr.arg1 == "flag") {
      compare1 = flag[pr.argflag1];
    } else {
      compare1 = pr.arg1;
    }
    if (pr.arg2 == "flag") {
      compare2 = flag[pr.argflag2];
    } else {
      compare2 = pr.arg2;
    }


    for (i = 0; i < parsescript.line.length; i++) {
      if (parsescript.line[i].name === pr.goto) {
        var goto = i
      };
      if (parsescript.line[i].name === pr.notgoto) {
        var notgoto = i
      }
    }



    if (pr.arg3 == "=") {
      if (compare1 == compare2) {
        programcounter = goto;

      } else {
        programcounter = notgoto;
      }
    }
    scriptcore();
  }

  if (pr.exe == "die") {
    programcounter = 0;
    lockplayer = false;
  }

  if (pr.exe == "setflag") {
    flag[pr.arg1] = pr.arg2;
    scriptcore();
  }

  if (pr.exe == "giveitem") {
    for (i = 0; i < bag.length; i++) {
      if (bag[i] == 0) {
        bag[i] = pr.arg1;

        array = dbitem[pr.arg1].m.split(',');
        textbox("You received a " + array[1]);

        break;
      }
    }
    //there's no scriptcore callback because it's in the textbox
  }

  if (pr.exe == "choose") {
    if (pr.argnum == 2) {
      for (i = 0; i < parsescript.line.length; i++) {
        if (parsescript.line[i].name === pr.arg1goto) {
          var goto1 = i
        };
        if (parsescript.line[i].name === pr.arg2goto) {
          var goto2 = i
        };
      }
      textbox(pr.argtext);
      $("#choosehook").show();
      $('<button class="button" style="color : white; background-color:rgba(0,0,0,0.3); border-color:#ffffff;" onclick="programcounter = ' + goto1 + '; scriptcore(); $(\'#textbox\').hide()" >' + pr.arg1 + ' </button>').appendTo("#choosehook");
      $('<button class="button" style="color : white; background-color:rgba(0,0,0,0.3); border-color:#ffffff;" onclick="programcounter = ' + goto2 + '; scriptcore(); $(\'#textbox\').hide()" >' + pr.arg2 + ' </button>').appendTo("#choosehook");
    }
  }

  if (pr.exe == "warp") {
    currentmap = pr.arg1;
    $("#gamehook").fadeOut(500);
    setTimeout(function(){renderMap(true); playerPos.gridx = parseInt(pr.arg2);
    playerPos.gridy = parseInt(pr.arg3); },500);

  }

  if (pr.exe == "givepokemon") {

      for (g = 0; g < 6; g++) {
        if (party[g].number == 0) {
          break;
        }
      }

      data = dbpokemon[pr.arg1]

      party[g].number = pr.arg1;
      party[g].name = data.Name;
      party[g].level = parseInt(pr.arg2);

      var stats = data.BaseStats.split(',');
      var base_ps = stats[0];
      var base_a = stats[1];
      var base_d = stats[2];
      var base_v = stats[3];
      var base_as = stats[4];
      var base_ds = stats[5];

      party[g].ps_iv = Math.round(Math.random() * 31);
      party[g].a_iv = Math.round(Math.random() * 31);
      party[g].d_iv = Math.round(Math.random() * 31);
      party[g].v_iv = Math.round(Math.random() * 31);
      party[g].as_iv = Math.round(Math.random() * 31);
      party[g].ds_iv = Math.round(Math.random() * 31);

      party[g].ps = Math.floor((2 * base_ps + party[g].ps_iv) * parseInt(pr.arg2) / 100 + parseInt(pr.arg2) + 10);
      party[g].psm = Math.floor((2 * base_ps + party[g].ps_iv) * parseInt(pr.arg2) / 100 + parseInt(pr.arg2) + 10);
      party[g].a = Math.floor(Math.floor((2 * base_a + party[g].a_iv) * parseInt(pr.arg2) / 100 + 5));
      party[g].d = Math.floor(Math.floor((2 * base_d + party[g].d_iv) * parseInt(pr.arg2) / 100 + 5));
      party[g].v = Math.floor(Math.floor((2 * base_v + party[g].v_iv) * parseInt(pr.arg2) / 100 + 5));
      party[g].as = Math.floor(Math.floor((2 * base_as + party[g].as_iv) * parseInt(pr.arg2) / 100 + 5));
      party[g].ds = Math.floor(Math.floor((2 * base_ds + party[g].ds_iv) * parseInt(pr.arg2) / 100 + 5));


      var moveline = data.Moves.split(',');
      var movelev = new Array();
      var movename = new Array();

      var fourcicle = 0;
      for (i = 0; i < moveline.length; i += 2) {
        movelev[movelev.length] = moveline[i];
      }

      for (i = 1; i < moveline.length; i += 2) {
        movename[movename.length] = moveline[i];
      }


      for (i = 1; i < movelev.length; i++) {
        if (parseInt(pr.arg2) >= movelev[i]) {
          if ((party[g].moves[0] != movename[i]) && (party[g].moves[1] != movename[i]) && (party[g].moves[2] != movename[i]) && (party[g].moves[3] != movename[i])) {
            if (fourcicle == 4) {
              fourcicle = 0;
            }
            party[g].moves[fourcicle] = movename[i];
            fourcicle++;
          }
        }
      }
      console.log(party[g]);
      textbox("You received a " + party[g].name);
  }

}

function loaditem(id) {
  $.ajax({
    url: "php/item.php?id=" + id
  }).done(function(lol) {
    var array = lol.split(',');
    return array;
  });
}


function textbox(text) {
  $("#textbox").show();
  $("#textmessage").text("");
  textmessage = text;
}

$("#textbox").click(function() {
  if (($("#textmessage").text().length == textmessage.length) && ($("#choosehook").is(":visible") == false) && (textboxautohide != true) ) {
    $("#textbox").hide();
    scriptcore();
  }
});

function textboxhide()
{
  if (textboxautohide == true)
  {
    $("#textbox").hide();
    textboxautohide = false;
  }
}

function textcacher() {
  if ($("#textbox").is(":visible")) {
    if ($("#textmessage").text().length < textmessage.length) {
      c = $("#textmessage").text().length + 1;
      $("#textmessage").text(textmessage.slice(0, c));
    } else if ((key.a === true) && ($("#choosehook").is(":visible") == false) && (textboxautohide != true)) {
      $("#textbox").hide();
      scriptcore();
    }
  }
  setTimeout(textcacher, 50);
}
textcacher();
