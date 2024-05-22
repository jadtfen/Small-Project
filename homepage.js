//  Revcieves 500 error
//  url base needs to be changed
const urlBase = 'http://urlBase';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	let tmp = {username:username, password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/login.' + extension;

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
				userId = jsonObject.UserId;
		
				if( userId < 1 )
				{		
					//  document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          // temp alert for testing
          alert("User/Password combination incorrect");
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				//  saveCookie();
	
				window.location.href = "contactpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
    //document.getElementById("loginResult").innerHTML = err.message;
    //  temp alert for testing
    alert("error");
	}

}

//  logout function the professor used in his example
/*
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
*/
