# PokemonjSDK
[![Build Status](https://travis-ci.org/koso00/PokemonjSDK.svg?branch=master)](https://travis-ci.org/koso00/PokemonjSDK)

The PokemonjSDK is a port of the PokemonSDK to the web, to make a better looking SDK, easier to mantain and easier to use, using javascript and json file format to import map.

## How to import maps
The PokemonjSDK is compatible with Tiled Editor json map format , but you __must__ follow some rules to make your map compatible with the project.

1. When you create a map create a new folder and in this folder create a subfolder called map where you will store your tilesets

```
/root folder
| - yourmap.json
|   /map
|   | - yourtileset1.png
|   | - yourtileset2.png
|   | - ...*.png
```
2. When you create your map set the compression to __XML__
3. When you create levels keep in mind that collisions, water and walkbehind levels are stored in the map, so you must create at least three levels called __Collisions__ , __Water__ and __WalkBehind__.
In Collisions place tile where you can't walk, in Water place tiles where there's water and in WalkBehind place tiles where you will be covered by the map , such as palaces or trees.

Once you're done with the map making place your map and your tilesets in the PokemonjSDK map folder, all together .

```
/PokemonjSDK/map folder
| - yourmap.json
| - yourtileset1.png
| - yourtileset2.png
| - ...*.png
```

To make the map load for first search for this snippet of code in the index.php file

``` javascript
PlayerAnimation();
moveplayer();
renderMap("lol.json");
```

and change
``` javascript
renderMap("lol.json");
```
to
``` javascript
renderMap("yourmap.json");
```
## How to tweak the engine

If you want you can tweak the script list.
Simply add API to the scriptcore function and tell the engine what to do with the script that you've created.

This is the scriptcore
``` javascript
function scriptcore()
{
  if (map.scripts[scriptid].line.length == programcounter)
  {
  programcounter = 0;
  lockplayer = false;
  return false;
  }
  var pr = map.scripts[scriptid].line[programcounter];
  programcounter ++
  if (pr.exe == "text")
  {
    textbox(pr.arg1);
    console.log(programcounter);
  }
}
```
note the section below
``` javascript
if (pr.exe == "text")
{
  textbox(pr.arg1);
  console.log(programcounter);
}
```
you can add a script API pasting a similar if under the last and you can call argument with arg1, arg2 , arg...

To create a script watch the map lol.json map file
```
"scripts": [
  {
    "line" : [{"exe" : "text", "arg1" : "Oh guarda un cartello, chissà che cosa significa"},
              {"exe" : "text", "arg1" : "DARK GANG, GANG BANG SICK LUKE SUL BEATBREAK SPORTSWEAR, AIR MAX COMFORT, CALVIN KLEIN"}],
    "x" : 33,
    "y" : 14,
    "type" : "pull"
  }
```
Scripts is an array, you can add a script by simply add a
```
  {
    "line" : [{"exe" : "text", "arg1" : "Oh guarda un cartello, chissà che cosa significa"},
              {"exe" : "text", "arg1" : "DARK GANG, GANG BANG SICK LUKE SUL BEATBREAK SPORTSWEAR, AIR MAX COMFORT, CALVIN KLEIN"}],
    "x" : 33,
    "y" : 14,
    "type" : "pull"
  }
```
 substructure to the last script.

A script is made of lines, x, y, and type
* line : an array that contain in every line the exe ( the API for the script) and the arg that are needed by the script.
* x : the x position on the map.
* y : the y position on the map.
* type : wheter if the script is an action button or a walk-on script.

## Internal scripting language

The internal scripting language is based on the pokemon Ruby script structure , similar to RPGmaker or similar programs.
Scripts are super easy to understand and are so easy to create.
There's a bunch of scripts ready and other in build.
Here's a list of scripts that are ready.

###### Setflag
``` javascript
{"exe" : "setflag" , "arg1" : "0" , "arg2" : "1"},
```
Set the "exe" to "setflag" , the "arg1" to the index of the flag that you want to set and the "arg2" with the value

###### Die
``` javascript
{"exe" : "die"},
```
Set the "exe" to "die" to make the script die;

###### Compare
``` javascript
{"exe" : "compare" , "arg1"  : "flag" , "argflag1" : "0" , "arg2" : 0 , "arg3" : "=" ,"goto" : "equal", "notgoto" : "notequal"}
```
Set the "exe" to "compare", in the arg1 or arg2 set what do you want to compare, if you want to compare a flag set a argflag"number" that contain the index of the flag that you want to compare.
In the arg3 define what tipe of comparation you want to do and then in "goto" and "notgoto" define in wich section the script will redirect the scriptcore wether if the comparation return true or false.
Keep in mind that section must be declared with the "name" attribute, like that
``` javascript
{"name" : "this is a section" , "exe" : "compare" , "arg1"  : "flag" , "argflag1" : "0" , "arg2" : 0 , "arg3" : "=" ,"goto" : "equal", "notgoto" : "notequal"}
```

###### Textbox
``` javascript
{"exe" : "text" , "arg1" : "I'm a text"}
```
Set the "exe" to "text" and fill the "arg1" with the text you want

###### Textboxes with choose
``` javascript
{"exe" : "choose" ,"argtext" : "Wich pokemon do you want?" , "argnum" : 2 , "arg1" : "bulbasaur" , "arg1goto" : "bulba","arg2" : "ivisaur","arg2goto" : "ivi"},
```
Set the "exe" to "choose" , fill "argtext" with the text you desire , set argnum with the number of choises that you want to create, then create arg"number" and arg"number"goto with respectively the text of the choosebox and the name of section that will be triggered.

###### Giveitem
``` javascript
{"exe" : "giveitem" , "arg1" : 1}
```
Set the "exe" to "giveitem" and the arg1 to the number of the object you want, you can read the list of the objects in /assets/items.ini
###### Givepokemon
``` javascript
{"exe" : "givepokemon" , "arg1" : 1,"arg2": 5}
```
Set the "exe" to "giveitem" and the arg1 to the number of the pokemon you want and the arg2 to the level you desire, you can read the list of the pokemons in /assets/pokemon.ini
