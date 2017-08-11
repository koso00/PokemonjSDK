<?
require("prettyprint.php");
$data = $_GET["data"];
unlink("../sav.json");
$fp = fopen('../sav.json', 'w');
fwrite($fp,prettyPrint( $data ));
fclose($fp);
echo "saved";
?>
