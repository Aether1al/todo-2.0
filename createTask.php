<?php
$filename = "tasks.txt";

$task_text = $_POST["task_text"];

$file = fopen($filename, "a+");
fwrite($file, $task_text . ";");
fclose($file);

echo "Задача сохранена";
?>