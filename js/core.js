currentmap = "map/mappa2.json";
var bump = new Audio('audio/bump.mp3');
var assets = "assets/"; //set the directory for your assets location

var joystick = new VirtualJoystick({
  container: document.getElementById("gamehook")
});
var map;
var flag = new Array(5000).fill(0);
var bag = new Array(10).fill(0);
var maploaded = false;
var jloaded = false;
var scriptflag = false;
var lockplayer = false;
var programcounter = 0;
var pause = false;
var scriptid = 0;
var textmessage = "";
var textboxautohide = false;
var party = [];
var mouse = {
  left: 0,
  top: 0
};
var j_ = 0;
var j__ = 0;
var menu_flag = false;
for (i = 0; i < 6; i++) {
  party[i] = {
    number: 0,
    name: 0,
    level: 0,
    ps_iv: 0,
    a_iv: 0,
    d_iv: 0,
    v_iv: 0,
    as_iv: 0,
    ds_iv: 0,
    ps: 0,
    psm: 0,
    a: 0,
    v: 0,
    d: 0,
    as: 0,
    ds: 0,
    moves: ["", "", "", ""]
  };
}
var enemy = {
  number: 0,
  name: 0,
  level: 0,
  ps_iv: 0,
  a_iv: 0,
  d_iv: 0,
  v_iv: 0,
  as_iv: 0,
  ds_iv: 0,
  ps: 0,
  psm: 0,
  a: 0,
  v: 0,
  d: 0,
  as: 0,
  ds: 0,
  moves: ["", "", "", ""]
}
var player = $("<canvas id = 'player' class='player' style='position:absolute; z-index : 1; width:64px; height:64px;' />").appendTo("#gamehook");
playerPos = {
    x: 0,
    y: 0,
    gridx: 33,
    gridy: 15,
    direction: 270
  },
  menuallowed = true,
  speed = 4,
  key = {
    right: false,
    left: false,
    up: false,
    down: false,
    s: false,
    a: false,
    enter: false
  },
  shipWidth = player.offsetWidth,
  shipHeight = player.offsetHeight;
moveto = {
    x: 0,
    y: 0
  },
  moving = false,
  editor = {
    tileselectedx: 0,
    tileselectedy: 0

  },
  collision = {
    right: false,
    left: false,
    top: false,
    bottom: false
  },
  tileid = {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0
  };
playerPos.x = moveto.x = playerPos.gridx * 32;
playerPos.y = moveto.y = playerPos.gridy * 32;

db = 3;

$.ajax({
  url: "php/moves.php"
}).done(function(lol) {
dbmoves = JSON.parse(lol);
dbloaded();
})

$.ajax({
  url: "php/item.php"
}).done(function(lol) {
dbitem = JSON.parse(lol);
dbloaded();
})

$.ajax({
  url: "php/pokemon.php"
}).done(function(lol) {
dbpokemon = JSON.parse(lol);
dbloaded();
})

function dbloaded(){
  db --;
  if (db == 0)
  {
    $('#preloader').delay(1700).fadeOut('slow');
    pokedexlistpopulate();
  }
}

$(".mapchanger").click(function() {
  playerPos.gridx = 0;
  playerPos.gridy = 0;
  currentmap = $(this).attr("mapvalue");
  renderMap();
})

function loadJSON(mapname, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', mapname, true); // Replace 'my_map' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

setInterval(function(){
  if ((maploaded == true) && (pause == false)) {
    document.title = playerPos.gridx + " " + playerPos.gridy + " " + pause;
    if ((moving == false) && (lockplayer == false)) {
      if ((key.right === true) || (joystick.right() == true)) {
        playerPos.direction = 0;
        if ((playerPos.gridx < map.width - 1) && (collisionright() == false)) {
          if ((key.s === true) || (joystick.deltaX() > 70)) {
            speed = 4;
          } else {
            speed = 2;
          }
          moving = true;
          scriptflag = false;
          moveto.x += 32;
          playerPos.gridx++;
        } else {
          bump.play();
        }
      } else if ((key.left === true) || (joystick.left() == true)) {
        playerPos.direction = 180;
        if ((playerPos.gridx != 0) && (collisionleft() == false)) {
          if ((key.s === true) || (joystick.deltaX() < -70)) {
            speed = 4;
          } else {
            speed = 2;
          }
          moving = true;
          scriptflag = false;
          moveto.x -= 32;
          playerPos.gridx--;
        } else {
          bump.play();
        }
      }
    }
    if ((moving == false) && (lockplayer == false)) {
      if ((key.up === true) || (joystick.up() == true)) {
        playerPos.direction = 90;
        if ((playerPos.gridy != 0) && (collisiontop() == false)) {
          if ((key.s === true) || (joystick.deltaY() < -70)) {
            speed = 4;
          } else {
            speed = 2;
          }
          moving = true;
          scriptflag = false;
          moveto.y -= 32;
          playerPos.gridy--;
        } else {
          bump.play();
        }
      } else if ((key.down === true) || (joystick.down() == true)) {
        playerPos.direction = 270;
        if ((playerPos.gridy < map.height - 1) && (collisionbottom() == false)) {
          if ((key.s === true) || (joystick.deltaY() > 70)) {
            speed = 4;
          } else {
            speed = 2;
          }
          moving = true;
          scriptflag = false;
          moveto.y += 32;
          playerPos.gridy++;
        } else {
          bump.play();
        }
      }
    }
    if (moving == false) {
      switch (playerPos.direction) {
        case 0:       i_ = 3;break;
        case 90:      i_ = 0;break;
        case 180:    i_ = 2;break;
        case 270:     i_ = 1;break;
      }
    } else {
      switch (playerPos.direction) {
        case 0:
          i_ = 3;break;
        case 90:    i_ = 0;     break;
        case 180:   i_ = 2;     break;
        case 270:   i_ = 1;     break;
      }
    }
    if ((moving == false) && ((playerPos.gridx * 32 != playerPos.x) || (playerPos.gridy * 32 != playerPos.y))) {
      moveto.x = playerPos.gridx * 32;
      moveto.y = playerPos.gridy * 32;
      playerPos.x = playerPos.gridx * 32;
      playerPos.y = playerPos.gridy * 32;
    }
    if ((playerPos.x == moveto.x) && (playerPos.y == moveto.y)) {
      moving = false;
      if (scriptflag == false) {
        if (map.scripts != undefined) {
          for (i = 0; i < map.scripts.length; i++) {
            if ((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y) && (map.scripts[i].type == "walk")) {
              scriptflag = true;
              scriptid = i;
              lockplayer = true;
              scriptcore();
            }
            if (((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y + 1) && (playerPos.direction == 90) && (map.scripts[i].type == "pull")) ||
            ((playerPos.gridx == map.scripts[i].x -1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 0) && (map.scripts[i].type == "pull")) ||
            ((playerPos.gridx == map.scripts[i].x  +1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 180) && (map.scripts[i].type == "pull")) ||
            ((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y - 1) && (playerPos.direction == 270) && (map.scripts[i].type == "pull"))) {
              scriptflag = true;
              scriptid = i;
              lockplayer = true;
              scriptcore();
            }
            if ((((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y + 1) && (playerPos.direction == 90) && (map.scripts[i].type == "button")) ||
            ((playerPos.gridx == map.scripts[i].x -1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 0) && (map.scripts[i].type == "button")) ||
            ((playerPos.gridx == map.scripts[i].x  +1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 180) && (map.scripts[i].type == "button")) ||
            ((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y - 1) && (playerPos.direction == 270) && (map.scripts[i].type == "button"))) && (key.a === true))  {
              scriptflag = true;
              scriptid = i;
              lockplayer = true;
              scriptcore();
            }
          }
        }
      }
    }
    if ((playerPos.x != moveto.x) && (moving == true)) {
      if (playerPos.x < moveto.x) {
        playerPos.x += speed;
      } else(playerPos.x -= speed);
    }
    if ((playerPos.y != moveto.y) && (moving == true)) {
      if (playerPos.y < moveto.y) {
        playerPos.y += speed;
      } else(playerPos.y -= speed);
    }
    $("#moveto").text(playerPos.gridy);
    $("#pos").text(playerPos.x);
    $("#player").css("left", playerPos.x - 16 + 'px');
    $("#player").css("top", playerPos.y - 32 + 'px');
    jloaded = true;
  }
  document.getElementById('gamehook').scrollLeft = playerPos.x - ($("#gamehook").width() / 2) + 32;
  document.getElementById('gamehook').scrollTop = playerPos.y - ($("#gamehook").height() / 2) + 32;

   if (($("#dropedit").is(":visible") == false) && ($("#dropadd").is(":visible")== false))
    {$("#mousefollow").hide();}


    var h = parseInt(Date().split(" ")[4].split(":")[0]);
    if ((h>4) && (h <=6)){ $("#dayfilter").css("background-color","#ff99cc")}
    if ((h>6) && (h <=8)){ $("#dayfilter").css("background-color","#ffcc99")}
    if ((h>8) && (h <=18)){ $("#dayfilter").css("background-color","rgba(0,0,0,0)")}
    if ((h>18) && (h <=20)){ $("#dayfilter").css("background-color","#993366")}
    if ((h>20) && (h <=22)){ $("#dayfilter").css("background-color","#333399")}
    if (((h>22) && (h <=24)) || ((h>=0) && (h <=3))){ $("#dayfilter").css("background-color","#000080")}
   },1000 / 60);



function collisionright()
{
for (ii = 0; ii < map.layers.length - 1; ii++) {
  if (map.layers[ii].name === "Collisions") {
    break;
  }
}
tileid = ((playerPos.gridy) * map.layers[ii].width) + playerPos.gridx + 1;
for (ii1 = 0; ii1 < map.layers.length - 1; ii1++) {
  if (map.layers[ii1].name === "Water") {
    break;
  }
}
tileid1 = ((playerPos.gridy) * map.layers[ii1].width) + playerPos.gridx + 1;

npc_collision = false;
for (i = 0; i < map.scripts.length; i++)
{
if ((playerPos.gridx == map.scripts[i].x -1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 0) && (map.scripts[i].type == "npc"))
{
npc_collision = true;
}
}

if ((map.layers[ii].data[tileid] == 0) && (map.layers[ii1].data[tileid1] == 0) && (npc_collision == false)) {
  return false;
} else {
  if ($("#nocollisioncheck").prop("checked") == false)
  {  return true;} else { return false;}
}
}

function collisionleft()
{
for (ii = 0; ii < map.layers.length - 1; ii++) {
  if (map.layers[ii].name === "Collisions") {
    break;
  }
}
tileid = ((playerPos.gridy) * map.layers[ii].width) + playerPos.gridx - 1;
for (ii1 = 0; ii1 < map.layers.length - 1; ii1++) {
  if (map.layers[ii1].name === "Water") {
    break;
  }
}
tileid1 = ((playerPos.gridy) * map.layers[ii1].width) + playerPos.gridx - 1;
npc_collision = false;
for (i = 0; i < map.scripts.length; i++)
{
if ((playerPos.gridx == map.scripts[i].x  +1 ) && (playerPos.gridy == map.scripts[i].y ) && (playerPos.direction == 180) && (map.scripts[i].type == "npc"))
{
npc_collision = true;
}
}
if ((map.layers[ii].data[tileid] == 0) && (map.layers[ii1].data[tileid1] == 0) && (npc_collision == false)) {
  return false;
} else {
  if ($("#nocollisioncheck").prop("checked") == false)
  {  return true;} else { return false;}
}
}

function collisiontop()
{
for (ii = 0; ii < map.layers.length - 1; ii++) {
  if (map.layers[ii].name === "Collisions") {
    break;
  }
}
tileid = ((playerPos.gridy - 1) * map.layers[ii].width) + playerPos.gridx;
for (ii1 = 0; ii1 < map.layers.length - 1; ii1++) {
  if (map.layers[ii1].name === "Water") {
    break;
  }
}
tileid1 = ((playerPos.gridy - 1) * map.layers[ii1].width) + playerPos.gridx;
npc_collision = false;
for (i = 0; i < map.scripts.length; i++)
{
if ((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y + 1) && (playerPos.direction == 90) && (map.scripts[i].type == "npc"))
{
npc_collision = true;
}
}
if ((map.layers[ii].data[tileid] == 0) && (map.layers[ii1].data[tileid1] == 0) && (npc_collision == false)) {
  return false;
} else {
  if ($("#nocollisioncheck").prop("checked") == false)
  {  return true;} else { return false;}
}
}

function collisionbottom()
{
for (ii = 0; ii < map.layers.length - 1; ii++) {
  if (map.layers[ii].name === "Collisions") {
    break;
  }
}
tileid = ((playerPos.gridy + 1) * map.layers[ii].width) + playerPos.gridx;
for (ii1 = 0; ii1 < map.layers.length - 1; ii1++) {
  if (map.layers[ii1].name === "Water") {
    break;
  }
}
tileid1 = ((playerPos.gridy + 1) * map.layers[ii1].width) + playerPos.gridx;
npc_collision = false;
for (i = 0; i < map.scripts.length; i++)
{
if  ((playerPos.gridx == map.scripts[i].x) && (playerPos.gridy == map.scripts[i].y - 1) && (playerPos.direction == 270) && (map.scripts[i].type == "npc"))
{
npc_collision = true;
}
}
if ((map.layers[ii].data[tileid] == 0) && (map.layers[ii1].data[tileid1] == 0) && (npc_collision == false)) {
  return false;
} else {
  if ($("#nocollisioncheck").prop("checked") == false)
  {  return true;} else { return false;}
}
}

function keyDown(e) {
  if (e.keyCode === 39) {
     e.preventDefault();
    key.right = true;
  } else if (e.keyCode === 37) {
     e.preventDefault();
    key.left = true;
  }
  if (e.keyCode === 38) {
     e.preventDefault();
    key.up = true;
  } else if (e.keyCode === 40) {
     e.preventDefault();
    key.down = true;
  }
  if (e.keyCode === 83) {
    key.s = true;
  }
  if (e.keyCode === 65) {
    key.a = true;
  }
  if (e.keyCode === 13) {
    key.enter = true;
  }
  if (e.keyCode === 35) {
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
   if ((key.enter === true) && (menuallowed == true) && (menu_flag == false)) {
     if ($("#gamemenu").is(":visible") == false) {
       menuopen();
     } else {
       menuclose();
     }
     menu_flag = true;
   }

}

function keyUp(e) {
  if (e.keyCode === 39) {
    key.right = false;
  } else if (e.keyCode === 37) {
    key.left = false;
  }
  if (e.keyCode === 38) {
    key.up = false;
  } else if (e.keyCode === 40) {
    key.down = false;
  }
  if (e.keyCode === 83) {
    key.s = false;
  }
  if (e.keyCode === 65) {
    key.a = false;
  }
  if (e.keyCode === 13) {
    menu_flag = false;
    key.enter = false;
  }
}
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

  old_j_ = 1;
  var sprite = new Image();
  sprite.src = "assets/player/1.png";
  sprite.onload = function() {
      setInterval(function () {
        if ((maploaded == true) && (jloaded == true)) {
          if (moving == true) {
            if ((j_ == 1) || (j_ == 2)) {old_j_ = j_ ; j_  = 0}else{ if (old_j_ == 1){j_ = 2}else{j_ = 1} }
          }else{j_ = 0;}
          canvas = document.getElementById("player");
          canvas.width = 64;
          canvas.height = 64;
          asd = canvas.getContext("2d");
          asd.clearRect(0, 0, 64, 64);
          if ((key.s===true) && (moving == true)) {asd.drawImage(sprite, 1 + (j_+4) * 32 + (j_+4) , 1+ i_ * 32 + i_ , 32, 32, 0, 0, 64, 64)}
          else {asd.drawImage(sprite, 1 + j_ * 32 + j_ , 1+ i_ * 32 + i_ , 32, 32, 0, 0, 64, 64)}
        }
    },100);
  }



function save() {
  var dat = {
    x: playerPos.gridx,
    y: playerPos.gridy,
    map: currentmap,
    name: "koso",
    flag: {},
    bag: {},
    party: {}
  }
  for (i = 0; i < 10; i++) {
    dat.flag[i] = flag[i];
    dat.bag[i] = bag[i];
  }
  for (i = 0; i < 6; i++) {
    dat.party[i] = party[i];
  }
  $.ajax({
    url: "php/save.php?data=" + JSON.stringify(dat)
  }).done(function(lol) {
    console.log(lol);
  });
}

function load() {
  loadJSON("sav.json", function(response) {
    dat = JSON.parse(response);
    for (i = 0; i < 10; i++) {
      flag[i] = dat.flag[i];
      bag[i] = dat.bag[i];
    }
    for (i = 0; i < 6; i++) {
      party[i] = dat.party[i];
    }
    currentmap = dat.map;
    playerPos.gridx = dat.x;
    playerPos.gridy = dat.y;
    console.log("loaded data for " + dat.name);
    renderMap();
  });
}

$("#scriptbutton").click(function() {
  var t = document.getElementById('scr').value;
  window[t]();
});

function pokedexpopulate(id)
{
  v = id;
  if (v < 10) {
    v = "00" + v;
  }
  if ((v < 100) && (v >= 10)) {
    v = "0" + v;
  }
  $("#pokedex").find("img").attr("src","assets/pokemon/"+v + ".gif");
  $("#pokedex").find("p").text(dbpokemon[id].Pokedex);
  $("#pokedex").find("type").text(dbpokemon[id].Type1);
  $("#pokedex").find("weight").text(dbpokemon[id].Weight);
  $("#pokedex").find("height").text(dbpokemon[id].Height);
}
npcsprite = new Image();
npcsprite.src = "assets/npc/1.png";

function populatenpclist()
{
          listw = 9;
          listh = 1;
          c = document.getElementById("dialogcanvas");
          c.width = 32 * listw;
          c.height = 32 * listh;
          npc = c.getContext("2d");
          npc.clearRect(0, 0, c.width, c.height);
          for (i = 0; i < listh; i++)
          {
            for (j = 0; j < listw; j++)
            {
              npc.drawImage(npcsprite,j * 32, i*32 + i * (32*9), 32, 32, j * 32 , i*32, 32, 32)
            }
          }
}

function drawnpc(j,i,d,id,special)
{
  c = id;
  if (special == false)
  {
  npcmoving = c.id.substr(3,c.id.length);
  npcmoving = map.scripts[parseInt(npcmoving)].moving;
}else{npcmoving = false;}

  c.width = 64;
  c.height = 64;
  npc = c.getContext("2d");
  npc.clearRect(0, 0, c.width, c.height);
  rot = 1;
  j = parseInt(j);
  i = parseInt(i);
  d = parseInt(d);
  i__ = 1;

  switch(d)
  {
    case 0:i__ =2;break;
    case 90 : i__ = 1;break;
    case 270 : i__ = 0;break;
    case 180: i__ = 2;break;
  }
  if ((npcmoving == true) && (j__ != 0))
  {
    switch(d)
    {
    case 0:i__ = 6+ j__;break;
    case 90 : i__ = 2 + j__;break;
    case 270 : i__ = 4 + j__;break;
    case 180:i__ = 6+ j__;break;
    }
  }
  npc.drawImage(npcsprite,j * 32, (i__*32) +  i * (32*9), rot * 32,rot* 32, 0 , 0, 64, 64)
  if (d == 0)
  {
    $("#"+c.id).addClass("flip");
  }else{
    $("#"+c.id).removeClass("flip");
  }
}
