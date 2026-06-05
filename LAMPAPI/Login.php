<?php
    $inData = getRequestInfo();

    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "WindyUser", "WindyPass123!", "WindyMail");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, PasswordHash FROM Users WHERE Login = ?");
        $stmt->bind_param("s", $login);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc())
        {
            if (password_verify($password, $row["PasswordHash"]))
            {
                returnWithInfo($row["ID"], $row["FirstName"], $row["LastName"]);
            }
            else
            {
                returnWithError("Invalid username or password");
            }
        }
        else
        {
            returnWithError("Invalid username or password");
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($id, $firstName, $lastName)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
