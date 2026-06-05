<?php
    $inData = getRequestInfo();

    $contactId = $inData["contactId"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "WindyUser", "WindyPass123!", "WindyMail");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
        $stmt->bind_param("ii", $contactId, $userId);

        if ($stmt->execute())
        {
            if ($stmt->affected_rows > 0)
            {
                returnWithInfo("Contact deleted successfully");
            }
            else
            {
                returnWithError("No contact was deleted");
            }
        }
        else
        {
            returnWithError("Contact could not be deleted");
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
