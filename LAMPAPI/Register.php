<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "WindyUser", "WindyPass123!", "WindyMail");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, PasswordHash) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);

        if ($stmt->execute())
        {
            returnWithInfo("User registered successfully");
        }
        else
        {
            returnWithError("Username may already exist");
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg)
    {
        $retValue = '{"message":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
