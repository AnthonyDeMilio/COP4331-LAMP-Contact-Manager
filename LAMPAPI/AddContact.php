<?php
    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "WindyUser", "WindyPass123!", "WindyMail");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);

        if ($stmt->execute())
        {
            returnWithInfo("Contact added successfully");
        }
        else
        {
            returnWithError("Contact could not be added");
        }

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
        $retValue = '{"message":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg)
    {
        $retValue = '{"message":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
