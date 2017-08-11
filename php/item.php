<?
$ini_array = parse_ini_file("../assets/items.ini",true);
echo json_encode($ini_array);
?>
