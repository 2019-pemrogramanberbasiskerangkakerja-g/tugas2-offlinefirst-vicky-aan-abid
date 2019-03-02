<?php
include('config.php');$sql = "SELECT * FROM accounts";
$query = $mysqli->query($sql);
$data = array();
while($row = $query->fetch_array(MYSQLI_ASSOC)){
$data[] = array("username" => $row['username'], "password" => $row['password']);
}
echo json_encode($data);?>