<?
require("prettyprint.php");
$data = $_POST["script"];
$file = $_GET["map"];
unlink("../".$file);
$fp = fopen("../".$file, 'w');
fwrite($fp, prettyPrint( $data ));
fclose($fp);
echo $data;
?>
