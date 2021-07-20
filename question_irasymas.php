<?php
// database connection code
if(isset($_POST['txtName']))
{
// $con = mysqli_connect('localhost', 'database_user', 'database_password','database');
$con = mysqli_connect('localhost', 'root', 'root','question_db');

// get the post records

$txtName = $_POST['txtName'];
$txtEmail = $_POST['txtEmail'];


// database insert SQL code
$sql = "INSERT INTO `klausimai_atsakymai` (`klausimo_nr`, `klausimas`, `atsakymas`)
 VALUES ('0', '$txtName', '$txtEmail')";

// insert in database 
$rs = mysqli_query($con, $sql);
if($rs)
{
	echo "Contact Records Inserted";
}
}
else
{
	echo "Are you a genuine visitor?";
	
}
?>
