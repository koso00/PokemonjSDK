<?
$ini_array = parse_ini_file("../assets/pokemon.ini",true);
echo json_encode($ini_array);
?>
