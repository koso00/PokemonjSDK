function renderMap(intro) {
  console.log("render map");
  $("#gamebackground").show();
  loadJSON(currentmap, function(response) {
    map = JSON.parse(response);
    tilewidth = 32;
    tileheight = 32;
    image = new Array();
    var count = map.tilesets.length;
    for (var i = 0; i < map.tilesets.length; i++) {
      map.tilesets[i].image;
      image[i] = new Image();
      var s = map.tilesets[i].image.split("/");
      var m ="map/tilesets/"+ s[s.length -1 ];
      image[i].src = m;
      image[i].onload = function() {
        count--;
        if (count == 0) {
          draw();
        }
      }
    }

    function gettile(tileIndex) {
      var pkt = {
        "img": null,
        "px": 0,
        "py": 0
      };
      var i = 0;
      for (i = map.tilesets.length - 1; i > 0; i--) {
        if (tileIndex >= map.tilesets[i].firstgid) {
          break;
        }
      }
      pkt.img = i;
      var localIdx = tileIndex - map.tilesets[i].firstgid;
      var lTileX = Math.floor(localIdx % Math.floor(map.tilesets[i].imagewidth / map.tilewidth));
      var lTileY = Math.floor(localIdx / Math.floor(map.tilesets[i].imagewidth / map.tilewidth));
      pkt.px = (lTileX * map.tilewidth);
      pkt.py = (lTileY * map.tileheight);
      return pkt;
    }

    function draw() {
      canvas = document.getElementById("mapcanvas");
      ctx = canvas.getContext('2d');
      canvas.width = map.width * tilewidth;
      canvas.height = map.height * tileheight;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      maploaded = true;
      if (map.layers[i] != "WalkBehind") {
        for (i = 0; i < map.layers.length; i++) {
          var dat = map.layers[i].data;
          for (tileIDX = 0; tileIDX < map.layers[i].data.length; tileIDX++) {
            var tID = dat[tileIDX];
            var tPKT = gettile(tID);
            worldY = Math.floor(tileIDX / map.layers[i].width) * tileheight;

            worldX = (tileIDX - (map.layers[i].width * (worldY / tilewidth))) * tilewidth;

            ctx.drawImage(image[tPKT.img], tPKT.px, tPKT.py, map.tilewidth, map.tileheight, worldX, worldY, tilewidth, tileheight);
            // console.log(tPKT.px + " " + tPKT.py + " " + worldX + " "+ worldY );
          }
        }
      }
      canvas = document.getElementById("mapbcanvas");
      ctx = canvas.getContext('2d');
      canvas.width = map.width * tilewidth;
      canvas.height = map.height * tileheight;
      ctx.fillStyle = "rgba(255,255,255,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < map.layers.length; i++) {
        if (map.layers[i].name === "WalkBehind") {

          var dat = map.layers[i].data;
          for (tileIDX = 0; tileIDX < map.layers[i].data.length; tileIDX++) {
            var tID = dat[tileIDX];
            var tPKT = gettile(tID);
            worldY = Math.floor(tileIDX / map.layers[i].width) * tileheight;

            worldX = (tileIDX - (map.layers[i].width * (worldY / tilewidth))) * tilewidth;

            ctx.drawImage(image[tPKT.img], tPKT.px, tPKT.py, map.tilewidth, map.tileheight, worldX, worldY, tilewidth, tileheight);
            // console.log(tPKT.px + " " + tPKT.py + " " + worldX + " "+ worldY );
          }
        }
      }
      if (map.scripts == undefined) {
        map.scripts = [];
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
            title: "Notice",
            content: "The SDK rewrited your map to allow scripts to be stored",
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
      }
      codeview();
      $("#dayfilter").show();
      $("#anitop").find("p").text(currentmap);
      switch(Date().split(" ")[1])
      {
        case "Aug": m = "SUMMER"; break;
        default : m = "";
      }
      $("#anibot").find("p").text(m);
      $("#gamehook").fadeIn(500);
      if (intro == true){setTimeout(function(){introanimation();},500);}
      $('#preloader').delay(1700).fadeOut('slow');
      if (scriptflag == true)
      {
        setTimeout(scriptcore,500);
      }
    }
  });
  return map;
}




function renderMapInto(thismap,canvas) {
  loadJSON(thismap, function(response) {
    thismap = JSON.parse(response);
    tilewidth = 32;
    tileheight = 32;
    image = new Array();
    var count = thismap.tilesets.length;
    for (var i = 0; i < thismap.tilesets.length; i++) {
      thismap.tilesets[i].image;
      image[i] = new Image();
      var s = thismap.tilesets[i].image.split("/");
      var m ="map/tilesets/"+ s[s.length -1 ];
      console.log(m);
      image[i].src = m;
      image[i].onload = function() {
        count--;
        if (count == 0) {
          draw();
        }
      }
    }

    function gettile(tileIndex) {
      var pkt = {
        "img": null,
        "px": 0,
        "py": 0
      };
      var i = 0;
      for (i = thismap.tilesets.length - 1; i > 0; i--) {
        if (tileIndex >= thismap.tilesets[i].firstgid) {
          break;
        }
      }
      pkt.img = i;
      var localIdx = tileIndex - thismap.tilesets[i].firstgid;
      var lTileX = Math.floor(localIdx % Math.floor(thismap.tilesets[i].imagewidth / thismap.tilewidth));
      var lTileY = Math.floor(localIdx / Math.floor(thismap.tilesets[i].imagewidth / thismap.tilewidth));
      pkt.px = (lTileX * thismap.tilewidth);
      pkt.py = (lTileY * thismap.tileheight);
      return pkt;
    }

    function draw() {
      ctx = canvas.getContext('2d');
      canvas.width = thismap.width * tilewidth;
      canvas.height = thismap.height * tileheight;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      maploaded = true;

        for (i = 0; i < thismap.layers.length; i++) {
          var dat = thismap.layers[i].data;
          for (tileIDX = 0; tileIDX < thismap.layers[i].data.length; tileIDX++) {
            var tID = dat[tileIDX];
            var tPKT = gettile(tID);
            worldY = Math.floor(tileIDX / thismap.layers[i].width) * tileheight;

            worldX = (tileIDX - (thismap.layers[i].width * (worldY / tilewidth))) * tilewidth;

            ctx.drawImage(image[tPKT.img], tPKT.px, tPKT.py, thismap.tilewidth, thismap.tileheight, worldX, worldY, tilewidth, tileheight);
            // console.log(tPKT.px + " " + tPKT.py + " " + worldX + " "+ worldY );
          }
        }
        var dialogs = $('.dialog');

        $.each(dialogs, function(){
            var dlg = $(this).data('dialog'), element = dlg.element;
            if (element.data('opened') !== true) {
                return;
            }
            dlg.reset();
        });
    }
  });
}
