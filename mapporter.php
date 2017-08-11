<head>
<meta charset="utf-8" />
<meta property="og:title" content="Pokemon jSDK">
<meta property="og:description" content="Early stage HTML/JS/PHP port of the PokemonSDK old project">
<meta property="og:image" content="img/banner.png">
<meta name="viewport" content="width=device-width">
<meta name="theme-color" content="#0072c6">
<title>Pokemon jSDK</title>
  <script src="js/jquery-3.2.1.min.js"></script>
  <link href="css/metro.css" rel="stylesheet">
	<link href="css/metro-icons.css" rel="stylesheet">
  <script src="js/metro.min.js"></script>
</head>


<div class="app-bar">
    <span class="app-bar-divider"></span>
    <ul class="app-bar-menu">
      <li><a href="index.php">SDK</a></li>
			<li><a href="">Map Porter</a></li>
    </ul>
</div>
<br>
<h4>Convert your map with tiled from tmx to json without any compression</h4>

<h4>Place your json map inside the /map folder</h4>

<h4>Reload the page and click on you map filename button</h4>

<h4>Copy all the tilesets listed after the conversion message</h4>

<?php
$dir = "map/*.json";
foreach (glob($dir) as $filename)
     echo "<a class=\"button\" onclick='$(this).addClass(\"m\"); load();' class='mapchanger' mapvalue =".$filename." >".ltrim(strstr($filename, '/'), '/')."</a>";
     echo "<br>"
?>
<script>
function loadJSON(mapname,callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', mapname, true); // Replace 'my_map' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

  function load() {
  var currentmap = $(".m").attr("mapvalue");
  $(".m").removeClass("m");
  loadJSON(currentmap,function(response) {
  map = JSON.parse(response);
  $("body").append("<h5> Tilesets required to run the map , remember to copy all these tilesets in /map/tilesets folder</h5> ");
  for (i = 0; i < map.tilesets.length ; i++)
  {
    var s = map.tilesets[i].image.split("/");
    var m ="tilesets/"+ s[s.length -1 ];
    map.tilesets[i].image = m;
  $("body").append("<p> " + s[s.length -1 ] + " <p>");
  }

  $("body").append("<br>");
  if (map.scripts == undefined) {
    $("body").append("<p> No scripts slot found </p> <br>");
    map.scripts = [];
    $("body").append("<p> Scripts slot added </p> <br>");
  }
  else{
    $("body").append("<p> Maybe you already ported the map </p> <br>");
  }
    $.ajax({
      type: "post",
      data : {"script" : JSON.stringify(map)} ,
      url: "php/rewritemap.php?map="+currentmap
    }).done(function(lol) {
      options = {
    		windowsStyle : true,
    		closeButton : false,
    		background : "#0072c6",
    		color : "#ffffff",
    		overlay : true
    	};
    	$.Dialog({
        title: "Map porter correctly",
        content: "Remember to copy all the tilesets listed inside /map/tilesets",
        actions: [
            {
                title: "Ok",
                onclick: function(el){
                    $(el).data('dialog').close();
                }
            }
        ],
        options: options

    });
    });





  });
  }

  console['log'] = function(msg){
  	$.Notify({
  	caption: 'Console log',
  	content: msg,
  	type: 'success'
  });
  }
 </script>
