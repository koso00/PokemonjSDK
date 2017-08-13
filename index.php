<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="Pokemon jSDK">
  <meta property="og:description" content="Early stage HTML/JS/PHP port of the PokemonSDK old project">
  <meta property="og:image" content="img/banner.png">
  <meta name="viewport" content="width=device-width">
  <meta name="theme-color" content="#0072c6">
  <title>Pokemon jSDK</title>
  <script src="js/jquery-3.2.1.min.js"></script>
  <script src="js/jquery-ui.js"></script>
  <link href="css/metro.css" rel="stylesheet">
  <link href="css/sdk.css" rel="stylesheet">
  <link href="css/metro-icons.css" rel="stylesheet">
  	<link rel="stylesheet" href="css/osumenu.css">
  <script src="js/virtualjoystick.js"></script>
  <script src="js/smooth-scroll.min.js"></script>
  <script src="js/osumenu.js"></script>

</head>
<main>
  <noscript>
	<div style="
	color: #FFF;
	background: #008CFF;
	margin: 0;
	height: 100%;
	width:100%;
	position:fixed;
	top:0;
	left:0;
	z-index:11;">
		<div style="position:absolute; left :10%; top :10%; right:10%;">
		  <h1 style="font-size: 8em;margin: 0;">:(</h1>
		  <p style="font-size: 1.4em;  margin-bottom: 3em;">Javascript is disabled, please enable js if you want to work with the PokemonSDK</a> </span></p>
		</div>
	</div>
	</noscript>

  <div class="app-bar">
    <span class="app-bar-divider"></span>
    <ul class="app-bar-menu">
      <li><a href="">SDK</a></li>

      <li>
        <a href="" class="dropdown-toggle"><span style="display:block; margin-top : 100%;" class="mif-menu"></span></a>
        <ul class="d-menu" data-role="dropdown">
          <li>
            <a href="" class="dropdown-toggle">Maps</a>
            <ul  class="d-menu" data-role="dropdown">
              <?php
                  $dir = "map/*.json";
                  foreach (glob($dir) as $filename)
                       echo "<li><a class='mapchanger' mapvalue =".$filename." >".ltrim(strstr($filename, '/'), '/')."</a></li>";
                  ?>
            </ul>
          </li>
        <li><a href="mapporter.php">Map porter</a></li>
        </ul>
      </li>

      <li style="position:absolute; right : 100px;">
      <label style=" margin-top : 15px; margin-left:10px;" class="switch-original">
        <input id="nocollisioncheck" type="checkbox"/>
        <span class="check"/>
      </label>
    </li>
<li style="position:absolute; right : 10;">No collision</li>


    </ul>
  </div>

  <div id="preloader" style="width:100%;height:100%; position:fixed; top:50px; left:0; background-color : white; z-index : 10;">
    <div data-role="preloader" data-type="ring" data-style="dark" style="margin:auto; left:0; right:0; top :35%;"></div>
  </div>


  <div id="gamebackground">

  </div>


  <div id="gamehook">
    <canvas id="mapcanvas"></canvas>
    <canvas id="mapbcanvas"></canvas>

    <div id="mousefollow"> </div>
    <div id="scriptboxcontainer"></div>
    <div id="npccontainer"></div>
    <div id="dropdownmenu" style="position:absolute">
    <a  style="display:none;" href="" class="dropdown-toggle"></a>
    <ul id="dropadd" class="d-menu" data-role="dropdown"  data-no-close="true">
        <li><a onclick='addscript(); $("#dropdownmenu").find("ul").hide(); ' > Add script</a></li>
        <li><a onclick='addscript(true); $("#dropdownmenu").find("ul").hide(); ' > Add npc</a></li>
    </ul>

    <a  style="display:none;" href="" class="dropdown-toggle"></a>
    <ul id="dropedit" class="d-menu" data-role="dropdown">
        <li><a onclick='addscript(); $("#dropdownmenu").find("ul").hide(); ' > Edit script</a></li>
        <li><a onclick='removescript(); $("#dropdownmenu").find("ul").hide(); ' > Delete script</a></li>
    </ul>
    </div>
  </div>


<div id ="introdiv" style=" right: 0; left: 0; top : 60px; margin : auto; position:absolute; width: 90%; height:400px; overflow:scroll;">
  <div style=" position:relative; height:700px; width:100%;">

  <div id ="anitop" style=" z-index : 3 ;position:absolute; top : 0; left : 0;">
    <div style=" position:absolute; width : 0; height : 0; left: 0 ; top: 0; border-left: 0px solid transparent; border-right : 800px solid transparent; border-top: 150px solid black;" >
    </div>
    <p style="position:absolute; left : 50px; top : 10px; font-size : 30px; color: white;"> Mappa </p>
  </div>

  <div id ="anibot" style="z-index : 3 ; position:absolute; bottom: 0; right: 0;" >
    <div style=" position:absolute; width : 0; height : 0; right: 0 ; bottom: 0; border-left: 800px solid transparent; border-right : 0px solid transparent; border-bottom: 150px solid black;"  >
    </div>
    <p style="position:absolute; text-align : right; right : 50px; bottom : 10px; font-size : 30px; color: white;"> Mappa </p>
  </div>
</div>


  <div id="dayfilter" style="display: none; position:absolute;z-index:3; top:0; height:700px;width:100%; opacity : 0.2; background-color : #ffcc99"></div>
</div>

  <div id="choosehook"></div>
  <div id="textbox" class="panel">
    <div class="content">
      <p id="textmessage"> </p>
    </div>
  </div>

  <div class="buttoncontainer">
    <button id="menubutton" onclick="if ($('#gamemenu').is(':visible') == false)
{
menuopen();
}else{
menuclose();
}" class="button"><span class="mif-menu"></span></button>
    <button id="bagbutton" onclick="bagclose();partyclose();pkdexclose();" class="button"><span class="mif-chevron-left"></span></button>
  </div>

  <div class="collection" id="gamemenu" style="">
    <div onclick="pkdexopen();" class="tile" data-role="tile">
      <div class="tile-content">
        <span class="tile-label">Pokedex</span>
      </div>
    </div>
    <div onclick="populateparty();partyopen()" class="tile" data-role="tile">
      <div class="tile-content">
        <span class="tile-label">Pokemon</span>
      </div>
    </div>
    <div class="tile" onclick="populatebag(); bagopen();" data-role="tile">
      <div class="tile-content">
        <span class="tile-label">Bag</span>
      </div>
    </div>
    <div class="tile" onclick="save()" data-role="tile">
      <div class="tile-content">
        <span class="tile-label">Save</span>
      </div>
    </div>
  </div>

  <div class="collection" id="pokedex">
    <div style="width:30%; heigth : 400px; overflow : scroll;  position:absolute; left: 0; top :0;">

      <br>
      <br>
      <br>
      <img style="display:block;" src=""/>
      <p> </p>
      <type></type>
      <height></height>
      <weight></weight>
      <number></number>
  </div>


  <div class="right-panel osu-wrapper">
    <div class="osu-top"></div>
    <ul id="pokedexlist" class="osu-list-wrapper">
<li class="osu-item"><div class="osu-item-title"></div><div class="osu-item-subtitle"></div></li>
    </ul>
    <div class="osu-spacer"></div>
  </div>



  </div>
  <div class="collection" id="bagmenu">
    <div class="padding20">
      <div class="listview" id="baglist">
      </div>
    </div>
  </div>

  <div class="collection" id="partymenu" style="">
    <div class="padding20">
      <div class="" id="partylist">
      </div>
    </div>
  </div>

  <div class="collection" id="start" style="">
    <div class="padding20">
      <div style="background: #008CFF; color:#FFF;" class="tile" onclick="load(); $('#menubutton').show(); renderMap('map/lol.json');  hidestart();" data-role="tile">
        <div class="tile-content">
          <span class="tile-label" id="continue">Continue</span>
        </div>
      </div>
      <div style="background: #008CFF;color:#FFF;" class="tile" onclick="currentmap = 'map/mappa1.json'; renderMap('map/lol.json');$('#menubutton').show();  hidestart();" data-role="tile">
        <div class="tile-content">
          <span class="tile-label">New game</span>
        </div>
      </div>
    </div>
  </div>



  <div class="collection" id="battle" style="">
  </div>
  <div id="battleactions">
  </div>
  <div  class="lifebarwrapenemy">
  <div  id="enemylifebar" class="lifebarenemy"></div>
  <p class="lv-lifebarenemy"> <p/>
  <p class="enemynamelifebar"> <p/>
  </div>
  <div class="lifebarwrap">
  <div  id="partylifebar" class="lifebar"></div>
  <p class = "hp-lifebarps"></p>
  <p class = "hp-lifebarpsm"></p>
  <p class = "lv-lifebar"></p>
  <p class="namelifebar"> <p/>
  <div class = "status-lifebar"> </div>
  <div class= "expbar">
  </div>
</div>


<div id="scriptnpclist">
  <canvas id="npclist"></canvas>
</div>

  <div class="collection" id="scriptconsole">
    <ul style="width : 100%;" id="sortable">
    </ul>
    <a class="button" onclick="savescript()"> Save </a>
    <a class="button" onclick="addline('text')"> Text </a>
    <a class="button" onclick="addline('choose')"> Text + Choose </a>
    <a class="button" onclick="addline('compare')"> Compare </a>
    <a class="button" onclick="addline('setflag')"> Setflag </a>
    <a class="button" onclick="addline('givepokemon')"> GivePokemon </a>
    <a class="button" onclick="addline('giveitem')"> GiveItem </a>
    <a class="button" onclick="addline('die')"> Die </a>
    <a class="button" onclick="addline('warp')"> Warp </a>
    <a class="button" onclick="addline('movenpc')"> MoveNpc </a>

      <div  class="input-control select">
    <select id="scripttype">
        <option>walk</option>
        <option>pull</option>
        <option>button</option>
    </select>
</div>
    <br> This is sooooooooooo incomplete bruh, click end to close this section
  </div>


</main>
<div class="bsod" id="bsod">
  <div id="errorhook">
    <h1>:(</h1>
    <p>The SDK ran into a problem, try to reload the page , if the problem persist open an issue on the <a style="color:white; text-decoration: underline;" href="https://github.com/koso00/PokemonjSDK">github </a> </span>
    </p>
  </div>
</div>
<!--
<script src="js/bsod.js"></script>-->
<script src="js/core.js"></script>
<script src="js/render.js"></script>
<script src="js/scriptcore.js"></script>
<script src="js/addscript.js"></script>
<script src="js/ui.js"></script>
<script src="js/battle.js"></script>

<script src="js/metro.js"></script>
