<?php

header('Content-Type: text/plain');

$folder = "videos";

$files = scandir($folder);
$first = true;
foreach($files as $file){
    if($file[0] != ".") {
        if($first == false) { echo "\n"; }
        $first = false;
        echo $folder."/".$file;
    }
}