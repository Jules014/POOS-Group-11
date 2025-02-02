const urlBase = 'http://COP4331-11.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doSignup()
{
    document.getElementById("loginResult").innerHTML = "";
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    // Check for empty logins
    let hasAlphanumeric = false;
    for (let i = 0; i < login.length; i++) {
	if ((login.charAt(i) >= '1' && login.charAt(i) <= '9') || (login.charAt(i) >= 'a' && login.charAt(i) <= 'z') || (login.charAt(i) >= 'A' && login.charAt(i) <= 'Z')) hasAlphanumeric = true;
    }
    if (!hasAlphanumeric)
    {
	document.getElementById("loginResult").innerHTML = "Your username must have at least one letter or one number.";
	return;
    }	
    // Check if the password is at least eight characters long
    if (password.length < 8)
    {
	document.getElementById("loginResult").innerHTML = "Your password must be at least eight characters long.";
	return;
    }
    // Check if the password has at least one number and letter
    let hasNumber = false;
    let hasUppercaseLetter = false;
    let hasLowercaseLetter = false;
    for (let i = 0; i < password.length; i++) {
	if (password.charAt(i) >= '0' && password.charAt(i) <= '9') hasNumber = true;
	if (password.charAt(i) >= 'a' && password.charAt(i) <= 'z') hasLowercaseLetter = true;
	if (password.charAt(i) >= 'A' && password.charAt(i) <= 'Z') hasUppercaseLetter = true;
    }
    if (!hasLowercaseLetter)
    {
	document.getElementById("loginResult").innerHTML = "Your password must have at least one lowercase letter.";
	return;
    }
    if (!hasUppercaseLetter)
    {
	document.getElementById("loginResult").innerHTML = "Your password must have at least one uppercase letter.";
	return;
    }
    if (!hasNumber)
    {		
	document.getElementById("loginResult").innerHTML = "Your password must have at least one number.";
	return;
    }

//    var passHash = md5(password);
    let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
	xhr.onreadystatechange = function() 
	{
	    if (this.readyState == 4 && this.status == 200) 
	    {
		let jsonObject = JSON.parse( xhr.responseText );
		let errorMessage = jsonObject.error;
		if (errorMessage != "")
		{
		    if (jsonObject.error == "Login Already Exists!") document.getElementById("loginResult").innerHTML = "That username has been taken.<br /> Please use a different username.";
		    else document.getElementById("loginResult").innerHTML = errorMessage;
		    return;
		}
		document.getElementById("loginResult").innerHTML = "User successfully added. Please return to the login page to access your new contact manager!";
//		userId = jsonObject.id;
//		firstName = jsonObject.firstName;
//		lastName = jsonObject.lastName;
//		saveCookie();
	    }
	};
	xhr.send(jsonPayload);
    }
    catch(err)
    {
	document.getElementById("loginResult").innerHTML = err.message;
    }
    
    // Check if the login already exists
    // (Maybe) check if the password fulfills certain requirements
    // Add user data to the database
}


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("displayName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {firstName:firstName, lastName:lastName, phone:phone, email:email, userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("loginResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}	
}


function searchContacts()
{
    let srch = document.getElementById("search").value;
    document.getElementById("searchResult").innerHTML = "";
    document.getElementById("contactTableBody").innerHTML = "";

    if (srch == "") return;
    let tableList = "";

    let tmp = {search:srch, userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchContacts.' + extension;
	
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
	xhr.onreadystatechange = function() 
	{
	    if (this.readyState == 4 && this.status == 200) 
	    {
		document.getElementById("searchResult").innerHTML = "Color(s) has been retrieved";
		let jsonObject = JSON.parse( xhr.responseText );
		let error = jsonObject.error;
		if (error != "No Records Found") {
		    for( let i=0; i<jsonObject.results.length; i++ )
		    {
			tableList += "<tr>";
			tableList += "<td>" + jsonObject.results[i].FirstName + "</td>";
			tableList += "<td>" + jsonObject.results[i].LastName + "</td>";
			tableList += "<td>" + jsonObject.results[i].Phone + "</td>";
			tableList += "<td>" + jsonObject.results[i].Email + "</td>";
			tableList += "<td>" + "Insert actions here later" + "</td>";
			tableList += "</tr>";
		    }
		    document.getElementById("contactTableBody").innerHTML = tableList;
		}
		else {
		    document.getElementById("searchResult").innerHTML = "No records found";
		}
	    }
	};
	xhr.send(jsonPayload);
    }
    catch(err)
    {
	document.getElementById("searchResult").innerHTML = err.message;
    }
}



/*
function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}
*/


function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function updateContactList(contacts) {
    const contactTableBody = document.getElementById("contactTableBody");
    const contactListDiv = document.querySelector(".contact-list");

    contactTableBody.innerHTML = "";

    if (contacts.length === 0) {
        //automatic height
        contactListDiv.style.height = "200px";
    } else {
        //resize of height
        contactListDiv.style.height = "auto";
    }

    contacts.forEach(contact => {
        let row = `<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.phone}</td>
            <td>${contact.email}</td>
            <td>
                <button class="edit-btn" onclick="updateContact('${contact.id}', '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}')">Update</button>
                <button class="delete-btn" onclick="deleteContact('${contact.id}')">Delete</button>
            </td>
        </tr>`;
        contactTableBody.innerHTML += row;
    });
}

//deletes a contact (when button is selected)
function deleteContact(contactId) {
    let tmp = { id: contactId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Contact deleted successfully!");
                //refreshes list after deletion
                searchContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.error(err.message);
    }
}

//updates an allows edits to be made to a contact
function updateContact(contactId, firstName, lastName, phone, email) {
    let newFirstName = prompt("Enter new first name:", firstName);
    let newLastName = prompt("Enter new last name:", lastName);
    let newPhone = prompt("Enter new phone number:", phone);
    let newEmail = prompt("Enter new email:", email);

    if (newFirstName && newLastName && newPhone && newEmail) {
        let tmp = { 
            id: contactId, 
            firstName: newFirstName, 
            lastName: newLastName, 
            phone: newPhone, 
            email: newEmail 
        };
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/UpdateContact.' + extension;
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    alert("Contact updated successfully!");
                    //refreshes list after deletion
                    searchContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.error(err.message);
        }
    }
}
