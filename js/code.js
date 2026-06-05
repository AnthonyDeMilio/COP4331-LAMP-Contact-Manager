const urlBase = 'https://windymail.top/LAMPAPI';

let userId = 0;
let firstName = "";
let lastName = "";

function saveUser(id, fName, lName)
{
    localStorage.setItem("userId", id);
    localStorage.setItem("firstName", fName);
    localStorage.setItem("lastName", lName);
}

function loadUser()
{
    userId = localStorage.getItem("userId");
    firstName = localStorage.getItem("firstName");
    lastName = localStorage.getItem("lastName");

    if (document.getElementById("userInfo") && userId)
    {
        document.getElementById("userInfo").innerHTML = "Welcome, " + firstName + " " + lastName;
    }
}

function doRegister()
{
    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let newLogin = document.getElementById("registerLogin").value;
    let newPassword = document.getElementById("registerPassword").value;

    let result = document.getElementById("registerResult");

    if (newFirstName === "" || newLastName === "" || newLogin === "" || newPassword === "")
    {
        result.innerHTML = "Please fill out all registration fields.";
        return;
    }

    let tmp =
    {
        firstName: newFirstName,
        lastName: newLastName,
        login: newLogin,
        password: newPassword
    };

    fetch(urlBase + "/Register.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        if (data.error && data.error !== "")
        {
            result.innerHTML = data.error;
        }
        else
        {
            result.innerHTML = "Account created. You can log in now.";
        }
    })
    .catch(error =>
    {
        result.innerHTML = "Registration failed.";
    });
}

function doLogin()
{
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    let result = document.getElementById("loginResult");

    if (login === "" || password === "")
    {
        result.innerHTML = "Please enter username and password.";
        return;
    }

    let tmp =
    {
        login: login,
        password: password
    };

    fetch(urlBase + "/Login.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        if (data.id < 1)
        {
            result.innerHTML = "Invalid username or password.";
        }
        else
        {
            saveUser(data.id, data.firstName, data.lastName);
            window.location.href = "contacts.html";
        }
    })
    .catch(error =>
    {
        result.innerHTML = "Login failed.";
    });
}

function addContact()
{
    loadUser();

    let cFirstName = document.getElementById("contactFirstName").value;
    let cLastName = document.getElementById("contactLastName").value;
    let cPhone = document.getElementById("contactPhone").value;
    let cEmail = document.getElementById("contactEmail").value;

    let result = document.getElementById("addResult");

    if (cFirstName === "" || cLastName === "")
    {
        result.innerHTML = "First and last name are required.";
        return;
    }

    let tmp =
    {
        userId: userId,
        firstName: cFirstName,
        lastName: cLastName,
        phone: cPhone,
        email: cEmail
    };

    fetch(urlBase + "/AddContact.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        if (data.error && data.error !== "")
        {
            result.innerHTML = data.error;
        }
        else
        {
            result.innerHTML = "Contact added successfully.";
	    searchContacts();

            document.getElementById("contactFirstName").value = "";
            document.getElementById("contactLastName").value = "";
            document.getElementById("contactPhone").value = "";
            document.getElementById("contactEmail").value = "";
        }
    })
    .catch(error =>
    {
        result.innerHTML = "Contact could not be added.";
    });
}

function searchContacts()
{
    loadUser();

    let search = document.getElementById("searchText").value;
    let result = document.getElementById("searchResult");
    let list = document.getElementById("contactsList");

    let tmp =
    {
        userId: userId,
        search: search
    };

    fetch(urlBase + "/SearchContacts.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        list.innerHTML = "";

        if (data.error && data.error !== "")
        {
            result.innerHTML = data.error;
            return;
        }

        let countBox = document.getElementById("contactCount");

if (countBox)
{
    countBox.innerHTML = data.results.length;
}

let bannerCount =
document.getElementById("contactCountBanner");

if (bannerCount)
{
    bannerCount.innerHTML = data.results.length;
}

if (data.results.length === 0)
{
    result.innerHTML = "No contacts found.";
    return;
}

result.innerHTML = data.results.length + " contact(s) found.";

        for (let i = 0; i < data.results.length; i++)
        {
            let contact = data.results[i];

            list.innerHTML += `
<div class="contact-item">

    <div class="contact-header">
        <div class="contact-avatar">
            ${contact.FirstName.charAt(0)}${contact.LastName.charAt(0)}
        </div>

        <div>
            <strong>${contact.FirstName} ${contact.LastName}</strong>
            <div class="contact-subtitle">WindyMail Contact</div>
        </div>
    </div>

    <div class="contact-details">
        <p>📞 ${contact.Phone}</p>
        <p>✉️ ${contact.Email}</p>
    </div>

    <div class="contact-actions">
        <button onclick="editContact(${contact.ID},
        '${contact.FirstName}',
        '${contact.LastName}',
        '${contact.Phone}',
        '${contact.Email}')">
        Edit
        </button>

        <button class="delete-btn"
        onclick="deleteContact(${contact.ID})">
        Delete
        </button>
    </div>

</div>
`;
        }
    })
    .catch(error =>
    {
        result.innerHTML = "Search failed.";
    });
}

function editContact(contactId, oldFirstName, oldLastName, oldPhone, oldEmail)
{
    document.getElementById("editSection").style.display = "block";

    document.getElementById("editContactId").value = contactId;
    document.getElementById("editFirstName").value = oldFirstName;
    document.getElementById("editLastName").value = oldLastName;
    document.getElementById("editPhone").value = oldPhone;
    document.getElementById("editEmail").value = oldEmail;

    document.getElementById("editResult").innerHTML = "";

    document.getElementById("editSection").scrollIntoView({ behavior: "smooth" });
}

function saveEditedContact()
{
    loadUser();

    let contactId = document.getElementById("editContactId").value;
    let newFirstName = document.getElementById("editFirstName").value;
    let newLastName = document.getElementById("editLastName").value;
    let newPhone = document.getElementById("editPhone").value;
    let newEmail = document.getElementById("editEmail").value;

    let result = document.getElementById("editResult");

    if (newFirstName === "" || newLastName === "")
    {
        result.innerHTML = "First and last name are required.";
        return;
    }

    let tmp =
    {
        contactId: contactId,
        userId: userId,
        firstName: newFirstName,
        lastName: newLastName,
        phone: newPhone,
        email: newEmail
    };

    fetch(urlBase + "/UpdateContact.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        if (data.error && data.error !== "")
        {
            result.innerHTML = data.error;
        }
        else
        {
            result.innerHTML = "Contact updated successfully.";
            document.getElementById("editSection").style.display = "none";
            searchContacts();
        }
    })
    .catch(error =>
    {
        result.innerHTML = "Contact could not be updated.";
    });
}

function cancelEdit()
{
    document.getElementById("editSection").style.display = "none";
}

function deleteContact(contactId)
{
    loadUser();

    if (!confirm("Are you sure you want to delete this contact?"))
    {
        return;
    }

    let tmp =
    {
        contactId: contactId,
        userId: userId
    };

    fetch(urlBase + "/DeleteContact.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tmp)
    })
    .then(response => response.json())
    .then(data =>
    {
        document.getElementById("searchResult").innerHTML = data.error || data.message;
        searchContacts();
    });
}

function logout()
{
    localStorage.clear();
    window.location.href = "index.html";
}

window.onload = loadUser;
