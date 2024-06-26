<?php 
    session_start();
    
    header("Content-Type: application/json");

    function compose_response($sessionActive, $fname, $lname, $user, $uid, $rescode){
        $res = [
            "sessionActive" => $sessionActive,
            "firstName" => $fname,
            "lastName" => $lname,
            "username" => $user,
            "userId" => $uid,
            "responseCode" => $rescode
        ];
        return $res;
    }

    // If a user is logged in this field will be set
    if (!isset($_SESSION["username"])){
        echo json_encode(compose_response(
            false, NULL, NULL, NULL, NULL, 404
        ));
        http_response_code(404);
    }
    else{
        echo json_encode(compose_response(
            true, $_SESSION["firstname"], $_SESSION["lastname"], $_SESSION["username"], 
            intval($_SESSION["userid"]), 200
        ));
        http_response_code(200);
    }
?>