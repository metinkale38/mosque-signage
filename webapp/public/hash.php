<?php
header('Content-Type: text/plain');


function exec_php($path){
    ob_start();
    require $path;
    return ob_get_clean();
}

function getDirContents($dir) {
    $files = scandir($dir);

    foreach ($files as $key => $value) {
        $path = $dir . DIRECTORY_SEPARATOR . $value;
        if ($value != "hash.php"){
            if (!is_dir($path)) {
                if(str_ends_with($path,".php")){
                    $content = exec_php($path);
                    echo substr($path,1)."=".md5($content)."\n"; 
                }else{
                    echo substr($path,1)."=".md5_file($path)."\n";
                }
            } else if ($value != "." && $value != "..") {
                getDirContents($path);
            }
        }
    }

}

getDirContents('.');