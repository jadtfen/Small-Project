<?php
    // inputting into database, firstname, lastname, email, phone number
    // for each user
    include("../config/database.php");
    include("../config/utils.php");
    session_start();

    header("Content-Type: application/json");

    // Function for forming registration response
    function compose_response($contactAdded, $msg, $rescode){
        $res = [
            "contactAdded" => $contactAdded, //boolean
            "message" => $msg, // string containing success or reason for failure
            "responseCode" => $rescode // response code
        ];
        return $res;
    }

    // Pass the response/code to emite if the connection fails
    $failResponse = compose_response(false, "There was a server-side issue with your request", 500);
    $conn = connect($failResponse);

    // Acquire necessary data
    $data = json_decode(file_get_contents("php://input"), true);
    $keys = ["firstName", "email", "phone", "userId"];

    // Check if the required data is present
    if (!all_keys_exist($keys, $data)){
        echo json_encode(compose_response(
            false, "One or more required values is not present", 400
        ));
        http_response_code(400);
        exit(1);
    }

    // Create local variable copies
    $firstname = $data["firstName"];
    $lastname = "";
    $email = $data["email"];
    $phone = $data["phone"];
    $userid = $data["userId"];

    if (array_key_exists("lastName", $data)){
        $lastname = $data["lastName"];
    }

    // Check if the user provided exists (should not be needed for normal web usage)
    $q = "SELECT userId FROM Users where userid = {$userid};";
    $qres = mysqli_query($conn, $q);
    if (mysqli_num_rows($qres) == 0){
        echo json_encode(compose_response(
            false, "Cannot add contact because the user provided does not exist", 400
        ));
        http_response_code(400);
        exit(1);
    }

    // Insert the new registered user into the database
    $q = "INSERT INTO Contacts (firstname, lastname, email, phone, userid)
    VALUES ('{$firstname}', '{$lastname}', '{$email}', '{$phone}', '{$userid}')";
    mysqli_query($conn, $q);
    mysqli_close($conn);

    echo json_encode(compose_response(
        true,
        "Contact added successfully",
        201
    ));
    http_response_code(201);
?>