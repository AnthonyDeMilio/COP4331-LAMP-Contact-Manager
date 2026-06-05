<?php
    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $search = $inData["search"];

    $conn = new mysqli("localhost", "WindyUser", "WindyPass123!", "WindyMail");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $searchTerm = "%" . $search . "%";

        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email 
                                FROM Contacts 
                                WHERE UserID = ? 
                                AND (FirstName LIKE ? 
                                     OR LastName LIKE ? 
                                     OR Phone LIKE ? 
                                     OR Email LIKE ?)
                                ORDER BY LastName, FirstName");

        $stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
        $stmt->execute();

        $result = $stmt->get_result();

        $contacts = array();

        while ($row = $result->fetch_assoc())
        {
            $contacts[] = $row;
        }

        returnWithInfo($contacts);

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = array();
        $retValue["results"] = array();
        $retValue["error"] = $err;

        sendResultInfoAsJson(json_encode($retValue));
    }

    function returnWithInfo($contacts)
    {
        $retValue = array();
        $retValue["results"] = $contacts;
        $retValue["error"] = "";

        sendResultInfoAsJson(json_encode($retValue));
    }
?>
