<?php

$filename = "tasks.txt";

$file = fopen($filename,file_exists($filename)?"a+":"w+");

fputs($file,$_POST["task_text"]. ";" );

fclose($file);

print_r(value: $_POST["task_text"]);