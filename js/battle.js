function damage(level,attack,powerofattack,defense)
{
var M = 1;
var damage = (Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * attack * powerofattack / defense) / 50) + 2) *M;
return damage
}

var battlevar ={
playerturn : false,
enemyturn : false,
playerpriority : 0,
enemypriority : 0
};
var playerflags = {
burn : false,
sleep : false,
sleepcount : 0
};
var enemyflags = {
burn : false,
sleep : false,
sleepcount : 0
};

function wildbattlecall(level,id)
{
console.log(battlevar);
  $("#gamehook").addClass("blur");
  $(".lifebarwrap").show();
  $(".lifebarwrapenemy").show();
  $("#battle").empty();
  $("#battle").show();
  createenemy(level,id);
  updatelifebar();
  textbox("A wild " + enemy.name + " appeared , what do you want to do?");
  createplayersprite();
  createenemysprite();
  populateaction();
}

function createplayersprite()
{
  v = party[0].number;
  if (party[0].number < 10) {
    v = "00" + party[0].number;
  }
  if ((party[0].number < 100) && (party[0].number >= 10)) {
    v = "0" + party[0].number
  }
  $("#battle").append("<img class='playerpokemon' src='assets/pokemon/" + v + "b.gif' />");
}

function createenemysprite()
{
  v = enemy.number;
  if (enemy.number < 10) {
    v = "00" + enemy.number;
  }
  if ((enemy.number < 100) && (enemy.number >= 10)) {
    v = "0" + enemy.number
  }
  $("#battle").append("<img class='enemypokemon' src='assets/pokemon/" + v + ".gif' />");
}

function createenemy(level,id)
{
    data = dbpokemon[id];
    enemy.number = id;
    enemy.name = data.Name;
    enemy.level = level;

    var stats = data.BaseStats.split(',');
    var base_ps = stats[0];
    var base_a = stats[1];
    var base_d = stats[2];
    var base_v = stats[3];
    var base_as = stats[4];
    var base_ds = stats[5];

    enemy.ps_iv = Math.round(Math.random() * 31);
    enemy.a_iv = Math.round(Math.random() * 31);
    enemy.d_iv = Math.round(Math.random() * 31);
    enemy.v_iv = Math.round(Math.random() * 31);
    enemy.as_iv = Math.round(Math.random() * 31);
    enemy.ds_iv = Math.round(Math.random() * 31);

    enemy.ps = Math.floor((2 * base_ps + enemy.ps_iv) * level / 100 + level + 10);
    enemy.psm = Math.floor((2 * base_ps + enemy.ps_iv) * level / 100 + level + 10);
    enemy.a = Math.floor(Math.floor((2 * base_a + enemy.a_iv) * level / 100 + 5));
    enemy.d = Math.floor(Math.floor((2 * base_d + enemy.d_iv) * level / 100 + 5));
    enemy.v = Math.floor(Math.floor((2 * base_v + enemy.v_iv) * level / 100 + 5));
    enemy.as = Math.floor(Math.floor((2 * base_as + enemy.as_iv) * level / 100 + 5));
    enemy.ds = Math.floor(Math.floor((2 * base_ds + enemy.ds_iv) * level / 100 + 5));

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
      if (level >= movelev[i]) {
        if ((enemy.moves[0] != movename[i]) && (enemy.moves[1] != movename[i]) && (enemy.moves[2] != movename[i]) && (enemy.moves[3] != movename[i])) {
          if (fourcicle == 3) {
            fourcicle = 0;
          }
          enemy.moves[fourcicle] = movename[i];
          fourcicle++;
        }
      }
    }
}

function populateaction()
{
  battlevar.enemyturn = false;
  battlevar.playerturn = false;
  $("#battleactions").empty();
  $("#battleactions").append("<button class='button action' >Fight</button>");
  $("#battleactions").append("<button class='button action' >Pokemons</button>");
  $("#battleactions").append("<button class='button action' >Bag</button>");
  $("#battleactions").append("<button class='button action' >Run</button>");
  $(".action").on("click",function(){
    textboxhide();
    if ($(this).text() == "Fight")
    {
      populatemoves()
      $(".action").off("click");
    }
    if ($(this).text() == "Run")
    {
      textbox("Got away safely");
      $("#battle").fadeOut();
      textboxhide();
      $(".action").off("click");
    }
  })
}

function populatemoves()
{
  $("#battleactions").empty();
  partymoveslength = 0;
  for (i= 0; i < 4; i ++)
  {
  if (party[0].moves[i] != "") {partymoveslength++}
}

  for (i = 0; i < partymoveslength; i++)
  {
    $("#battleactions").append("<button class='button move' >" + party[0].moves[i] + "</button>");
  }
  $(".move").on("click",function(){
    $(".move").off("click");
    playermove = $(this).text()
    checkpriority();
  })
}

function checkpriority()
{
  movescallback = 2;
  enemymoveslenght = 0;
  for (i = 0; i < 4; i ++)
  {if (enemy.moves[i] != "") {enemymoveslenght++}}
  enemymove = enemy.moves[Math.floor(Math.random() * enemymoveslenght)];
  enemymove ="TACKLE";
  playermove = "TACKLE";

    console.log("the player move is " + playermove);
    var array = dbmoves[playermove].m.split(',');
    battlevar.playerpriority = parseInt(array[9]);

    console.log("the enemy move is " + enemymove)
    var array = dbmoves[enemymove].m.split(',');
    battlevar.enemypriority = parseInt(array[9]);
    proceed()

}

function proceed()
{

    if (battlevar.playerpriority > battlevar.enemypriority)  {playerturn(); console.log("the player attack for first");}
    if (battlevar.playerpriority < battlevar.enemypriority)  {enemyturn();console.log("the enemy attack for first"); }
    if (battlevar.playerpriority == battlevar.enemypriority)
    {
      if (party[0].v > enemy.v) {playerturn(); console.log("the player attack for first because of speed");}
      if (party[0].v < enemy.v) {enemyturn();console.log("the enemy attack for first because of speed"); }
      if (party[0].v == enemy.v){
        if (Math.random() > 0.5) {playerturn();console.log("the player attack for first ,it's a question of luck bruh");} else {enemyturn();console.log("the enemy attack for first, it's a question of luck bruh"); }
      }
  }

}

function playerturn()
{
  console.log("player turn");
  battlevar.playerturn = true;
    var array = dbmoves[playermove].m.split(',');
    switch (array[1])
    {
      case "000":
      if (array[4] == "Special") {a = party[0].as; d = enemy.ds}else{a = party[0].a; d = enemy.d}
      dmg = damage(party[0].level,a,parseInt(array[2]),d);
      console.log("the player inflicts " + dmg + " damage");
      enemy.ps -= dmg;
      updatelifebar();
      if (enemy.ps <= 0)
      {
        console.log("Hai vinto");
      }
      break;
    }
    if (battlevar.enemyturn == false) {enemyturn()} else { populateaction()}

}

function enemyturn()
{
  console.log("enemy turn");
  battlevar.enemyturn = true;
  var array = dbmoves[enemymove].m.split(',');
    switch (array[1])
    {
      case "000":
      if (array[4] == "Special") {a = enemy.as; d = party[0].ds}else{a = enemy.a; d = party[0].d}
      dmg = damage(enemy.level,a,parseInt(array[2]),d);
      console.log("the enemy inflicts " + dmg + " damage");
      party[0].ps -= dmg;
      updatelifebar();
      if (party[0].ps <= 0)
      {
        console.log("Hai perso");
      }
      break;
      default :
      console.log("fra non sto capendo");
      break;
    }
    if (battlevar.playerturn == false) {playerturn()} else { populateaction()}
}




function updatelifebar()
{
  $(".lv-lifebar").text(party[0].level);
  $(".lv-lifebarenemy").text(enemy.level);
  $(".hp-lifebarps").text(party[0].ps);
  $(".hp-lifebarpsm").text(party[0].psm);
$(".namelifebar").text(party[0].name);
$(".enemynamelifebar").text(enemy.name);

  $("#enemylifebar").css("width" , (enemy.ps/enemy.psm) * 94 +"px" )
  if (enemy.ps/enemy.psm < 0.5){$("#enemylifebar").css("background-color","yellow")}
  if (enemy.ps/enemy.psm < 0.2){$("#enemylifebar").css("background-color","red")}
  $("#partylifebar").css("width" , (party[0].ps/party[0].psm) * 94 +"px" )
  if (party[0].ps/party[0].psm < 0.5){$("#partylifebar").css("background-color","yellow")}
  if (party[0].ps/party[0].psm < 0.2){$("#partylifebar").css("background-color","red")}
}
