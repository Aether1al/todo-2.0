<?php

$filename = "tasks.txt";

$file = fopen($filename,file_exists($filename)?"a+":"w+");

$list_tasks = fgets($file);

$list_tasks = explode(";", $list_tasks);

echo json_encode($list_tasks);
