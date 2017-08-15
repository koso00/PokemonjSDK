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
  <link href="css/sdk.css" rel="stylesheet">
  <link href="css/docs.css" rel="stylesheet">
  <link href="css/metro-icons.css" rel="stylesheet">
  	<link rel="stylesheet" href="css/osumenu.css">
  <script src="js/virtualjoystick.js"></script>
  <script src="js/smooth-scroll.min.js"></script>
  <script src="js/osumenu.js"></script>

</head>

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

  <header class="masthead">
        <div class="container">
          <a href="/" class="masthead-logo">
            <span class="mega-octicon octicon-package"></span>
            PokemonJS
          </a>
          <nav class="masthead-nav">
            <div class="form-checkbox"> <label class="text-white"><input id="nocollisioncheck" type="checkbox"/>No collisions</label></div>
          </nav>
        </div>
      </header>

<main style="position:relative;">
  <div id="preloader" style="width:100%;height:100%; position:fixed; top:60px; left:0; background-color : #4078c0; z-index : 10;">
    <div class="loader" style="margin:auto; left:0; right:0; top :40%;"></div>
  </div>


  <div class="gameframes" id="gamebackground">

  </div>


  <div class="gameframes" id="gamehook">
    <canvas id="mapcanvas"></canvas>
    <canvas id="mapbcanvas"></canvas>

    <div id="mousefollow"> </div>
    <div id="scriptboxcontainer"></div>
    <div id="npccontainer"></div>

    <div id="dropdownmenu" style="position:absolute; z-index:99999">
    <a  style="display:none;" onclick="$('#dropadd').toggle()" class="dropdown-toggle"></a>

    <nav id="dropadd" style=" display:none;width : 200px;" class="menu right">
      <a onclick='addscript(); $("#dropdownmenu").find("nav").hide(); '  class="menu-item " >Add script</a>
      <a onclick='addscript(true); $("#dropdownmenu").find("nav").hide(); ' class="menu-item" >Add npc</a>
    </nav>

    <a  style="display:none;" onclick="$('#dropedit').toggle()" class="dropdown-toggle"></a>

    <nav id="dropedit" style=" display:none;width : 200px;" class="menu right">
      <a onclick='addscript(); $("#dropdownmenu").find("nav").hide(); '  class="menu-item " >Edit script</a>
      <a onclick='removescript(); $("#dropdownmenu").find("nav").hide(); ' class="menu-item" >Remove script</a>
    </nav>

    </div>
  </div>


<div id ="introdiv" class="gameframes" style=" height:400px; overflow:scroll;">
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

  <div  class=" gameframes buttoncontainer">
    <button id="menubutton" class="btn" onclick="if ($('#gamemenu').is(':visible') == false)
{
menuopen();
}else{
menuclose();
}" ><span class="mif-menu"></span></button>
    <button id="bagbutton" class="btn" onclick="bagclose();partyclose();pkdexclose();" ><span class="mif-chevron-left"></span></button>
  </div>

  <div class="gameframes collection" id="gamemenu" style="">
    <br>
    <br>
    <nav style="width : 200px;" class="menu right">
  <a  onclick="pkdexopen();" class="menu-item selected" href="#">Pokedex</a>
  <a  onclick="populateparty();partyopen()" class="menu-item" href="#">Pokemon</a>
  <a  onclick="populatebag(); bagopen();"class="menu-item" href="#">Bag</a>
  <a onclick="save()"class="menu-item" href="#">Save</a>
</nav>

  </div>

  <div class="gameframes collection" id="pokedex">
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
  <div class="gameframes collection" id="bagmenu">
    <div class="padding20">
      <div class="listview" id="baglist">
      </div>
    </div>
  </div>

  <div class="gameframes collection" id="partymenu" style="">
    <div class="padding20">
      <div class="" id="partylist">
      </div>
    </div>
  </div>

  <div class="collection" id="start" style="">
    <div class="jumbotron">
        <div class="container">
          <h1>PokemonjSDK </h1>
          <p> A hackable html/js/css pokèmon engine/SDK</p>
          <span class="mif-pencil"></span><p style="display:inline"> with </p><span class="mif-heart"></span><p style="display:inline"> by </p><strong style="display:inline">Koso00</strong><br><br>
          <a onclick="load(); $('#menubutton').show(); renderMap('map/lol.json');  hidestart();" class="btn btn-reverse">
          Continue
          </a>
          <a   onclick="currentmap = 'map/mappa1.json'; renderMap('map/lol.json');$('#menubutton').show();  hidestart();" class="btn btn-reverse">
            New game
          </a>
        </div>
      </div>
  </div>



  <div class="gameframes collection" id="battle" style="">
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
<br>
  <div class="collection" id="scriptconsole">
    <ul style="width : 100%;" id="sortable">
    </ul>
    <a class="btn" onclick="savescript()"> Save </a>
    <a class="btn danger" onclick="closeconsole()"> Close </a><br>
    <a class="btn" onclick="addline('text')"> Text </a>
    <a class="btn" onclick="addline('choose')"> Text + Choose </a>
    <a class="btn" onclick="addline('compare')"> Compare </a>
    <a class="btn" onclick="addline('setflag')"> Setflag </a>
    <a class="btn" onclick="addline('givepokemon')"> GivePokemon </a>
    <a class="btn" onclick="addline('giveitem')"> GiveItem </a>
    <a class="btn" onclick="addline('die')"> Die </a>
    <a class="btn" onclick="addline('warp')"> Warp </a>
    <a class="btn" onclick="addline('movenpc')"> MoveNpc </a>


    <select class="form-select" id="scripttype">
        <option>walk</option>
        <option>pull</option>
        <option>button</option>
    </select>

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
