mousereal ={
  top :false,
  left:false
}
buttons = "<button onclick='$(this).parent().addClass(\"nameedit\"); nameedit();' class='button scriptnameedit'><span class='mif-pin'></span> </button>"+
"<button onclick='$(this).parent().addClass(\"lineedit\"); addline();' class='button scriptbuttonedit' ><span class='mif-more-horiz'></span> </button>"+
"<button onclick='$(this).parent().remove()' class='button scriptdelete' > <span class='mif-bin'></span> </button></li>";
edit_script = false;
edit_script_id = 0;
edit_script_content = {};
options = {
  windowsStyle: true,
  closeButton: false,
  background: "#ffffff",
  color: "#000000",
  overlay: true
};
$('body').mousemove(function(e) {
  mouse.left = e.pageX - $(document).scrollLeft() - $('#mapcanvas').offset().left,
    mouse.top = e.pageY - $(document).scrollTop() - $('#mapcanvas').offset().top
    mousereal.left = e.pageX - $(document).scrollLeft();
    mousereal.top = e.pageY - $(document).scrollTop();
});

setInterval(function(){
  if (document.getElementById("dialogcanvas") != null)
  {
  m_left = mousereal.left - $('.dialog-content').find("div").offset().left +  $('.dialog-content').find("div").scrollLeft();
  m_top = mousereal.top - $('.dialog-content').find("div").offset().top +  $('.dialog-content').find("div").scrollTop();
  $(".mousefollow").css("left", Math.floor(m_left / 32) * 32  + "px");
  $(".mousefollow").css("top", Math.floor(m_top / 32) * 32 + "px");
}
},50);

function addscript(npc){
    scriptobj = {
      line: [],
      x: 0,
      y: 0,
      type: "pull"
    };
    pause = true;
    if (npc == true)
    {
      create_dialog({
        title: "Choose your npc",
        content: "",
        actions: [{
            title: "Ok",
            onclick: function(el) {
              scriptobj.type = "npc";
              scriptobj.npcdirection = 270;
              if ($("#dialog-input").val() == "") { t = Math.floor(Math.random*99);}else{t = $("#dialog-input").val();}
              scriptobj.npcid = t;
              scriptobj.movingonscript = false;
              scriptobj.npcx = $("#dialog-input2").val();
              scriptobj.npcy = $("#dialog-input3").val();
              scriptobj.moving = false;
              scriptobj.movetox = scriptcoor.x *32;
              scriptobj.movetoy = scriptcoor.y *32 ;
              scriptobj.orx = scriptcoor.x;
              scriptobj.ory = scriptcoor.y;
              $("#scriptconsole").append("<canvas id='selectednpc' ></canvas><br>");
              drawnpc($("#dialog-input2").val(),$("#dialog-input3").val(),scriptobj.npcdirection,document.getElementById("selectednpc"),true);
              $(el).data('dialog').close();
              $("#mousefollow").hide();
              $("#scriptconsole").show();
            }
          },
          {
            title: "Cancel",
            onclick: function(el) {
              if (lineobj.exe == undefined) { line.remove();}
              $("#mousefollow").hide();
              $("#scriptconsole").hide();
              codeview();
              pause = false;
              $(el).data('dialog').close();
            }
          }
        ],
        options: options
      });
      $(".dialog-content").append("<p> id </p><input id ='dialog-input' type='text'  > <p> x </p><input id ='dialog-input2' type='text'  > </input> <p> y </p><input id ='dialog-input3' type='text'> </input> <br> ");
      $(".dialog-content").append("<div style='position:relative ; width:100%; overflow:scroll; ::-webkit-scrollbar {display: visible;}' >  <div class='mousefollow'></div> <canvas id='dialogcanvas' class='left'></canvas></div>");
      populatenpclist();
            $('.dialog-content').find("div").on("click",function(){
        $("#dialog-input2").val(Math.floor(m_left / 32));
        $("#dialog-input3").val(Math.floor(m_top / 32));
      });
    }else{
      $("#mousefollow").hide();
      $("#scriptconsole").show();
    }
    $("#sortable").empty();
    for (i = 0; i < map.scripts.length; i++) {
      if ((scriptcoor.x == map.scripts[i].x) && (scriptcoor.y == map.scripts[i].y)) {
        $("#scripttype").val(map.scripts[i].type)
        for (g = 0; g < map.scripts[i].line.length; g++) {
            $("<li class='script scriptns' data-script='" + JSON.stringify(map.scripts[i].line[g]) + "' > <p></p>"+
            buttons).appendTo("#sortable");
        }
        settextonlines();
        edit_script = true;
        edit_script_id = i;
        edit_script_content = map.scripts[i];
        map.scripts.splice(i, 1);
        codeview();
      }
    }
    $("#scriptboxcontainer").append("<div style='left:" + (scriptcoor.x * 32) + " ; top : " + (scriptcoor.y * 32) + "' class=' scriptedit'></div>");
}

function addline(id) {
  line = $(".lineedit");
  line.removeClass("lineedit");
  if (line.attr("data-script") == undefined)
  {
    exe = id;
    line = $("<li data-script=' {}'"+
    "class='ui-state-default script scriptns'><p> </p>"+buttons).appendTo("#sortable");
    lineobj = {};
  }else{
  lineobj = JSON.parse(line.attr("data-script"));
  exe = lineobj.exe;
}
  if (exe == "text") {
    create_dialog({
      title: "Input your Text",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "text";
            lineobj.arg1 = $("#dialog-input").val();
            line.attr("data-script",JSON.stringify(lineobj));
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $(el).data('dialog').close();
          }
        }
      ],
      options: options
    });
    t = lineobj.arg1 || "";

    $(".dialog-content").append("<input style='height:100px; width: 70%;' id ='dialog-input' type='text' value = '" +t+"' > </input>");
  }

  if (exe == "die")
  {
    lineobj.exe = "die";
    line.attr("data-script",JSON.stringify(lineobj));
    settextonlines();
  }

  if (exe == "choose") {
    create_dialog({
      title: "Input your Text",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "choose";
            lineobj.argtext =  $("#dialog-input").val();
            lineobj.argnum = 2;
            lineobj.arg1 =  $("#dialog-inputoption1").val();
            lineobj.arg1goto = $("#dialog-goto1").val();
            lineobj.arg2 = $("#dialog-inputoption2").val();
            lineobj.arg2goto = $("#dialog-goto2").val();
            line.attr("data-script",JSON.stringify(lineobj));
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $(el).data('dialog').close();
          }
        }
      ],
      options: options

    });
    t = lineobj.argtext || "";
    t1 = lineobj.arg1 || "";
    t2 = lineobj.arg1goto || "";
    t3 = lineobj.arg2 || "";
    t4 = lineobj.arg2goto || "";
    $(".dialog-content").append("<input id ='dialog-input' type='text' value = '" +t+"'> </input>"+
    "<p> option 1 </p>"+
  "<input id ='dialog-inputoption1' type='text' value = '" +t1+"'> </input> "+
  "<p> goto </p>"+
  "<input id ='dialog-goto1' type='text' value = '" +t2+"'> </input>"+
  "<p> option 2 </p>"+
  "<input id ='dialog-inputoption2' type='text' value = '" +t3+"'> </input>"+
  "<p> goto </p>"+
  "<input id ='dialog-goto2' type='text'value = '" +t4+"' > </input>");
  }


  if (exe == "givepokemon") {
    create_dialog({
      title: "Insert the id and the level of pokemon",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "givepokemon";
            lineobj.arg1 = $("#dialog-input1").val();
            lineobj.arg2 = $("#dialog-input2").val();
            line.attr("data-script",JSON.stringify(lineobj));
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $(el).data('dialog').close();
          }
        }
      ],
      options: options

    });
    t = lineobj.arg1|| "";
    t1 = lineobj.arg2|| "";
    $(".dialog-content").append("<p> id </p> <input id ='dialog-input1' type='text'value = '" +t+"' > </input>"+
    " <p> level </p><input id ='dialog-input2' type='text' value = '" +t1+"' > </input> ");
  }

  if (exe == "giveitem") {
    create_dialog({
      title: "Insert the id of the item",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "giveitem";
            lineobj.arg1 = $("#dialog-input").val();
            line.attr("data-script",JSON.stringify(lineobj));
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $(el).data('dialog').close();
          }
        }
      ],
      options: options

    });
    t = lineobj.arg1 || "";
    $(".dialog-content").append("<p> id </p> <input id ='dialog-input' type='text' value = '" +t+"'> </input> ");
  }



  if (exe == "warp") {
      create_dialog({
      title: "Canvas",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "warp";
            lineobj.arg1 = $('.dialog-content').find("select").val();
            lineobj.arg2 = $('#dialog-input2').val();
            lineobj.arg3 = $('#dialog-input3').val();
            line.attr("data-script",JSON.stringify(lineobj));
            $('.dialog-content').find("div").off("click");
            $('.dialog-content').find("select").off("change");
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $('.dialog-content').find("div").off("click");
            $('.dialog-content').find("select").off("change");
            $(el).data('dialog').close();
          }
        }
      ],
    options: options

    });

    var string = "<select>";
    for (i = 0; i < maplist.length; i ++)
    {
    string += "<option>"+maplist[i]+"</option>";
    }
    string += "</select>";
    $(".dialog-content").append(string);

    t = lineobj.arg1 || $('.dialog-content').find("option").val();
    $('.dialog-content').find("select").val(t);
    t1 = lineobj.arg2 || 0;
    t2 = lineobj.arg3 || 0;
    $(".dialog-content").append(" <p> x </p><input id ='dialog-input2' type='text' value = '" +t1+"' > </input> <p> y </p><input id ='dialog-input3' type='text' value = '" +t2+"'> </input> <br> ");
    $(".dialog-content").append("<div style='position:relative ; width:100%; height :400px; overflow:scroll; ::-webkit-scrollbar {display: visible;}' >  <div class='mousefollow'></div> <canvas id='dialogcanvas'></canvas></div>");
    renderMapInto("map/CITTA_INIZIALE.json",document.getElementById("dialogcanvas"));

    var click = false;

    $('.dialog-content').find("select").on("change",function(){
      renderMapInto($(this).val(),document.getElementById("dialogcanvas"));
    });


    $('.dialog-content').find("div").on("click",function(){
      $("#dialog-input2").val(Math.floor(m_left / 32));
      $("#dialog-input3").val(Math.floor(m_top / 32));
    });
  }



  if (exe == "movenpc") {
    create_dialog({
      title: "Input id and direction of npc",
      content: "",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            lineobj.exe = "movenpc";
            arr = [];

            c = 0;
            $(".npcmovelist").each(function(){

              if ($(this).find("p").length != 0)
              {
                ms = [];
                $(this).find("p").each(function(){
                  ms.push($(this).text());
                });
               arr.push( { entity : $(".dialog-content").find("option")[c].value ,move : ms });
              }
              c++
            })

            lineobj.arg1 = arr;
            line.attr("data-script",JSON.stringify(lineobj));
            settextonlines();
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            if (lineobj.exe == undefined) { line.remove();}
            $(el).data('dialog').close();
          }
        }
      ],
      options: options
    });
    t = lineobj.arg1 || "";


    string = "<div  class='input-control select'><select><option>player</option> ";
    string2 = "<div class='npcmovelist' style='display:none;' id='npcmoveplayer'></div>";
    for (i = 0; i< map.scripts.length;i++) {
      if (map.scripts[i].type == "npc"){
      console.log("found a npc")
      string += "<option>"+map.scripts[i].npcid+"</option>";
      string2 +="<div class='npcmovelist' style='display:none;' id='npcmove"+map.scripts[i].npcid+"'></div>";
      }
    }
    string += "</select></div>";
    $(".dialog-content").append(string);
    $(".dialog-content").append("<button class='button npcmovebutton'>up</button>");
    $(".dialog-content").append("<button class='button npcmovebutton'>left</button>");
    $(".dialog-content").append("<button class='button npcmovebutton'>right<b/utton>");
    $(".dialog-content").append("<button class='button npcmovebutton'>down<b/utton>");
    $(".dialog-content").append(string2);
    $("#"+$(".npcmovelist")[0].id).show();
    $(".dialog-content").find("select").on("change",function(){
    $(".npcmovelist").hide();
    $("#npcmove"+$(".dialog-content").find("select").val()).show();
  });

    $(".npcmovebutton").on("click",function(){
      $("#npcmove"+$(".dialog-content").find("select").val()).append("<p class='npcmovedir'>"+$(this).text()+ "</p>");

    $(".npcmovedir").off("click");
    $(".npcmovedir").on("click",function(){
      $(this).remove();
    })
    });


  }

}


function nameedit() {
  id = JSON.parse($(".nameedit").attr("data-script"));
    create_dialog({
      title: "Input the name of your section",
      content: "Leave blank if you want to delete your section name",
      actions: [{
          title: "Ok",
          onclick: function(el) {
            if ($("#dialog-input").val() != "")
            {
            id.name = $("#dialog-input").val();
            $(".nameedit").attr("data-script",JSON.stringify(id));
          }else{
            id.name = 23890832940298349802432908;    //only to unlink the name property, i think nobody will call his section like that. if you do , deal with it lol
            $(".nameedit").attr("data-script",JSON.stringify(id));
          }
          settextonlines();
            $(".nameedit").removeClass("nameedit");
            $(el).data('dialog').close();
          }
        },
        {
          title: "Cancel",
          onclick: function(el) {
            $(".nameedit").removeClass("nameedit");
            $(el).data('dialog').close();
          }
        }
      ],
      options: {
        windowsStyle: true,
        closeButton: false
      }

    });
    $(".dialog-content").append("<br> <br><input id ='dialog-input' type='text' value = ''> </input>");
  }

function savescript() {
  pause = false;
  $('#sortable').find('li').each(function() {
    scriptobj.line.push(JSON.parse($(this).attr('data-script')));
  });
  if (scriptobj.type != "npc"){ scriptobj.type = $("#scripttype").val();}

  if (scriptobj.line.length != 0) {
    scriptobj.x = scriptcoor.x;
    scriptobj.y = scriptcoor.y;
    map.scripts.push(scriptobj);

    for (i = 0; i < map.scripts.length;i ++)
    {
      if (map.scripts[i].type == "npc"){
        map.scripts[i].x  = map.scripts[i].orx;
        map.scripts[i].y  = map.scripts[i].ory;
      }
    }

      rewritemap(currentmap,JSON.stringify(map));

      codeview();
      $(".scriptedit").remove();
      $("#scriptconsole").hide();

  } else {
    codeview();
    $(".scriptedit").remove();
    $("#scriptconsole").hide();
    $("#selectednpc").remove();
    //console.log("Script not saved because null");
  }
}

function removescript() {
      for (i = 0; i < map.scripts.length; i++) {
        if ((scriptcoor.x == map.scripts[i].x) && (scriptcoor.y == map.scripts[i].y)) {
          map.scripts.splice(i, 1);

                rewritemap(currentmap,JSON.stringify(map));
            console.log("Removed script successfully");
            codeview();

        }
      }
}

function settextonlines(){
  $('#sortable').find('li').each(function() {
    line = JSON.parse($(this).attr('data-script'));
    switch(line.exe){
      case "text": m = "Text : " +line.arg1; break;
      case "choose" : m = "Text : "+ line.argtext + " / " + line.arg1 + " / "+ line.arg2; break;
      case "die" : m = "Die"; break;
      case "warp" : m = "Warp : " + line.arg1 + " " + line.arg2 + " " + line.arg3; break;
      case "givepokemon" : m = "GivePokemon : " + line.arg1 + " " + line.arg2; break;
      case "giveitem" : m = "GiveItem : " + line.arg1; break;
      case "movenpc" : m = "Move "+ line.arg1 + " "+ line.arg2; break;
      default  :m = "";
    }
    $(this).find("p").text(m);
    $(this).removeClass("scripts");
    $(this).addClass("scriptns");
    if (line.name != undefined)
    {
      if(line.name != 23890832940298349802432908)
      {
        $(this).find("p").text(  line.name + " --- " +$(this).find("p").text())
        $(this).removeClass("scriptns");
        $(this).addClass("scripts");
      }
    }
  });
}

$(function() {
  $("#sortable").sortable();

});

function getscript() {
  $('#sortable').find('li').each(function() {
    scriptobj.line.push(JSON.parse($(this).attr('data-script')));
  });
}


function codeview() {
  $("#scriptboxcontainer").empty();
  for (i = 0; i < map.scripts.length; i++) {
    var s = map.scripts[i];
    $("#scriptboxcontainer").append("<div style='left:" + (s.x * 32) + " ; top : " + (s.y * 32) + "' class='scriptbox'></div>");
  }
  npckill();
  npcentities();
  npclife();
}

function closeconsole(){
  if ($("#scriptconsole").is(":visible") == true) {
    $("#mousefollow").hide();
    $("#scriptconsole").hide();
    $("#selectednpc").remove();
    if (edit_script == true)
    {
      map.scripts.push(edit_script_content);
      edit_script = false;
    }
    codeview();
    pause = false;
  }
}

function dropdownopenhandler(){

  $("#dropedit").hide();
  $("#dropadd").hide();
  scriptcoor = {
    x: Math.floor(mouse.left / 32),
    y: Math.floor(mouse.top / 32)
  }
  $("#mousefollow").show();
  $("#mousefollow").css("left", Math.floor(mouse.left / 32) * 32) + "px";
  $("#mousefollow").css("top", Math.floor(mouse.top / 32) * 32) + "px";
  $("#dropdownmenu").css("left",mouse.left +2  );
  $("#dropdownmenu").css("top",mouse.top);
  if (map.scripts.length != 0){
  for (i = 0; i < map.scripts.length; i++) {
    if ((scriptcoor.x == map.scripts[i].x) && (scriptcoor.y == map.scripts[i].y))
    {
      $("#dropadd").hide();
      console.log("edit because script")
      $("#dropedit").show();
  }else{ if ($("#dropedit").is(":visible") == false){
    console.log("add because script")
    $("#dropadd").show();}
  }
}
}else{
  console.log("add because no script")
  $("#dropadd").show();
}
}




click = false;

/*
$("#introdiv").mousedown(function(){
  if (click == false)
  {
    $("<div style='position: absolute; left: " + (mouse.left -20) +  " ; top : " +(mouse.top-20) +";'  class='long'></div>").appendTo("#gamehook");
      long = false;
      click = true;
      longpress = setTimeout(function(){ long = true },1000)
  }
})

$("#introdiv").mouseup(function(ev){
  if (click == true)
  {
    click = false;
    $(".long").remove();
    if (long == true){

      if ($("#scriptconsole").is(":visible") == false)
      {
    dropdownopenhandler();
      }

    }else{

      if (($("#dropedit").is(":visible") == true) || ($("#dropadd").is(":visible") == true)){
      $("#dropedit").hide(200);
      $("#dropadd").hide(200);}
      if ((ev.which == 3) && ($("#scriptconsole").is(":visible") == false))
      {
      dropdownopenhandler();
      }
    }
    clearTimeout(longpress)
  }
})*/
