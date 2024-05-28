<?php
    include("../config/database.php");
    include("../config/utils.php");
    session_start();

    header("Content-Type: application/json");

    function compose_response($n_contacts, $t_contacts, $contacts, $msg, $rescode){
        $res = [
            "numContacts" => $n_contacts,
            "totalContacts" => $t_contacts,
            "contacts" => $contacts,
            "message" => $msg,
            "responseCode" => $rescode
        ];
        return $res;
    }

    $failResponse = compose_response(0, 0, NULL, "There was a server-side issue with your request", 500);
    $conn = connect($failResponse);

    // Acquire data
    $data = json_decode(file_get_contents("php://input"), true);
    $required_keys = ["page", "perPage", "userId"];
    $optional_keys = ["firstName", "lastName"];

    // Check for required values
    check_required_values($required_keys, $data);

    // Store required values in local vars
    $page = $data["page"];
    $per_page = $data["perPage"];
    $userid = $data["userId"];

    // Check if required types are integers, exit if false
    if (gettype($page) !== "integer" || gettype($per_page) !== "integer"
        || gettype($userid) !== "integer"){
        echo json_encode(compose_response(
            0, 0, NULL, "Incorrect data types provided: page, perPage, and userId must be int", 400 
        ));
        http_response_code(400);
        exit(1);
    }

    // Add vars for non-required keys
    $firstname = "";
    $lastname = "";
    if (array_key_exists("firstName", $data) && $data["firstName"] !== NULL
        && !ctype_space($data["firstName"])){
        $firstname = $data["firstName"];
    }
    if (array_key_exists("lastName", $data) && $data["lastName"] !== NULL
        && !ctype_space($data["lastName"])){
        $lastname = $data["lastName"];
    }
    
    // Build the query
    $q = "SELECT * FROM Contacts WHERE userid = {$userid} ";
    $count_q = "SELECT COUNT(*) AS count FROM Contacts WHERE userid = {$userid} ";
    if ($firstname !== ""){
        $q = $q."AND firstname LIKE '%{$firstname}%' ";
        $count_q = $count_q."AND firstname LIKE '%{$firstname}%' ";
    }
    if ($lastname !== ""){
        $q = $q."AND lastname LIKE '%{$lastname}%' ";
        $count_q = $count_q."AND lastname LIKE '%{$lastname}%' ";
    }
    $start_index = $per_page * ($page - 1);
    $q = $q."ORDER BY firstName, lastName ASC ";
    $q = $q."LIMIT {$start_index}, {$per_page};";
    $count_q = $count_q.";";

    // Capture query result
    $qres = mysqli_query($conn, $q);
    $count_qres = mysqli_query($conn, $count_q);
    mysqli_close($conn);
    // Fetch the array of contacts
    $contacts = mysqli_fetch_all($qres, MYSQLI_ASSOC);
    $total = mysqli_fetch_all($count_qres, MYSQLI_ASSOC)[0]["count"];

    // Emit success response
    echo json_encode(compose_response(
        count($contacts), intval($total), $contacts, "Contacts returned successfully", 200
    ));
    http_response_code(200);
?>