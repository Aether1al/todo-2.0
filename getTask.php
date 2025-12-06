<?php
$FileName = "tasks.txt";
$file = fopen($FileName,"r");
$task = fgets($file);
// echo $task;
echo json_encode(explode(";",substr($task,0,-1)));