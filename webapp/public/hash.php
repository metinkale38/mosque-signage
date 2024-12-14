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

        if(str_starts_with($path, "./logs")) continue;
        //if($_REQUEST["hostname"] == "rpimosq"){
            if(str_starts_with($path, "./images")) continue;
            if(str_starts_with($path, "./videos")) continue;
        //}
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

$log = "LAST_ACCESS=".date("Y-m-d_H:i:s")."\nLAST_IP=".$_SERVER['REMOTE_ADDR']."\nLAST_FORWARDEDFOR_HEADER=".$_SERVER['HTTP_X_FORWARDED_FOR']."\n";
file_put_contents("./logs/".$_REQUEST["hostname"].".log", $log);