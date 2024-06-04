let userId;
let firstName;
let lastName;

// Information for searches
let curPage;
let perPage;
let maxPages; // implement this
let curRendered;

// Current search params
let searchFirstName = "";
let searchLastName = "";
let searchPhone = "";
let searchEmail = "";

$(document).ready(function() {
    // Sends the session request, but with modifications
    $.ajax({
        type: 'POST',
        url: './api/session.php',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({}),
        error: function(xhr) {
            window.location.assign("login.html");
        }
    })
    .done(function(data){
        console.log(data);
        if (data.sessionActive === true){
            // Set necessary globals
            curPage = 1;
            perPage = 10;
            userId = data.userId;
            firstName = data.firstName;
            lastName = data.lastName;
            // Login bar
            $("#login-name").html(`Logged in as: ${firstName} ${lastName}`);
            // Load initial contacts
            getContacts(curPage, perPage, userId, null, null, null, null);
        }
        else{
            window.location.assign("login.html");
        }
    });
    
    // Search
    $("#searchForm").submit(function(e) {
        e.preventDefault();

        searchFirstName = $("#firstName").val();
        searchLastName = $("#lastName").val();
        searchPhone = $("#phone").val();
        searchEmail = $("#email").val();

        if (searchFirstName === "" && searchLastName === "" &&
            searchPhone === "" && searchEmail === "")
            return;

        // Perform search, display first page
        setFirst();
    });
});

function renderContacts(contacts) {
    curRendered = contacts;
    const container = document.getElementById('contactsContainer');
    // Reset html back to the original header row
    container.innerHTML = `
        <div class="row text-center mx-3">
            <div id="first-name-label" class="contact-item-header-box col-2 border border-right-0 border-1 py-3">First Name</div>
            <div id="last-name-label" class="contact-item-header-box col-2 border border-right-0 border-1 py-3">Last Name</div>
            <div id="phone-label" class="contact-item-header-box col-2 border border-right-0 border-1 py-3">Phone</div>
            <div id="email-label" class="contact-item-header-box col-3 border border-right-0 border-1 py-3">Email</div>
            <div class="contact-item-header-box col-3 border border-1 py-3">Options</div>
        </div>
    `;
    contacts.forEach(contact => {
        const row = document.createElement('div');
        row.className = 'row mx-3';
        row.innerHTML = `
            <div class="contact-item-box col-2 border border-right-0 border-top-0 border-1 py-3 px-1 align-items-center">
                <input class="contact-field" aria-labelledby="first-name-label" value="${contact.firstName}" readonly></input>
            </div>
            <div class="contact-item-box col-2 border border-right-0 border-top-0 border-1 py-3 px-1 align-items-center">
                <input class="contact-field" aria-labelledby="last-name-label" value="${contact.lastName}" readonly></input>
            </div>
            <div class="contact-item-box col-2 border border-right-0 border-top-0 border-1 py-3 px-1 align-items-center">
                <input class="contact-field" aria-labelledby="phone-label" value="${contact.phone}" readonly></input>
            </div>
            <div class="contact-item-box col-3 border border-right-0 border-top-0 border-1 py-3 px-1 align-items-center">
                <input class="contact-field" aria-labelledby="email-label" value="${contact.email}" readonly></input>
            </div>
            <div class="d-flex contact-item-box col-3 border border-top-0 border-1 align-items-center justify-content-center" style="gap: 10px">
                <button class="contact-mod-btn btn btn-darkhover d-inline" onclick='editContact(this)'>Edit</button>
                <button class="contact-mod-btn btn btn-darkhover d-none" onclick='confirmContact(this, ${parseInt(contact.contactId)})'>Confirm</button>
                <button class="contact-mod-btn btn btn-darkhover d-none" onclick='cancelEditContact(this, ${JSON.stringify(contact)})'>Cancel</button>
                <button class="contact-mod-btn btn btn-darkhover d-inline" onclick='deleteContact(${JSON.stringify(contact)})'>Delete</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function getContacts(page, perPage, userId, firstName, lastName, phone, email){
    $.ajax({
        type: 'POST',
        url: './api/searchContact.php',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            page: page,
            perPage: perPage,
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email
        }),
        success: function(response) {
            maxPages = Math.ceil(response.totalContacts / perPage);
            renderContacts(response.contacts);
        },
        error: function(xhr) {
            $(".error-text").html(xhr.responseJSON.message);
        }
    });
}

// Function for clicking the view all button
function viewAll(){
    $("#searchForm")[0].reset();
    searchFirstName = "";
    searchLastName = "";
    searchPhone = "";
    searchEmail = "";
    setFirst();
}

function editContact(element){
    // Get necessary html elements
    const box = $(element).parent();
    const row = $(box).parent();
    const btns = box.find("button");
    const inputs = row.find("input");
    // Remove Edit button visibility
    $(btns[0]).addClass("d-none");
    $(btns[0]).removeClass("d-inline");
    // Make Confirm button visible
    $(btns[1]).addClass("d-inline");
    $(btns[1]).removeClass("d-none");
    // Make Cancel button visible
    $(btns[2]).addClass("d-inline");
    $(btns[2]).removeClass("d-none");
    // Make inputs editable
    inputs.each(function() {
        $(this).prop("readonly", false);
    });
}

function confirmContact(element, contactId){
    const box = $(element).parent();
    const row = $(box).parent();
    const inputs = row.find("input");

    // Capture inputted values
    const values = [];
    inputs.each(function() {
        values.push($(this).val());
    });
    // Validation
    const [validated, err] = validateEdits(values[0], values[2], values[3]);
    // Send if validated
    if (validated){
        $.ajax({
            type: 'POST',
            url: './api/updateContact.php',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                contactId: contactId,
                firstName: values[0],
                lastName: values[1],
                phone: values[2],
                email: values[3],
            }),
            success: function(response){
                getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
                $(".error-text").html("");
            },
            error: function(xhr){
                $(".error-text").html(xhr.responseJSON.message);
            }
        });
    }
    else{
        $(".error-text").html(err);
    }
}

function cancelEditContact(element, contact){
    // HTML fields
    const box = $(element).parent();
    const row = $(box).parent();
    const inputs = row.find("input");
    const btns = box.find("button");
    // Values of contact originally
    const originalVals = [contact.firstName, contact.lastName, contact.phone, contact.email];
    for (let i = 0; i < inputs.length; i++){
        $(inputs[i]).val(originalVals[i]);
        $(inputs[i]).prop('readonly', true);
    }
    // Add Edit button visibility
    $(btns[0]).addClass("d-inline");
    $(btns[0]).removeClass("d-none");
    // Make Confirm button invisible
    $(btns[1]).addClass("d-none");
    $(btns[1]).removeClass("d-inline");
    // Make Cancel button invisible
    $(btns[2]).addClass("d-none");
    $(btns[2]).removeClass("d-inline");
    // Clear error field
    $(".error-text").html("");
}

function validateEdits(firstName, phone, email){
    if (firstName === undefined || firstName === null || firstName.length < 1)
        return [false, "Including a first name is required"];
    const phonePattern = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}");
    if (!phonePattern.test(phone))
        return [false, "Phone number does not meet the required format (XXX-XXX-XXXX)"];
    const emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}");
    if (!emailPattern.test(email))
        return [false, "Email does not meet the required format (example@example.com)"];
    return [true, null];
}

function deleteContact(contact) {
    const confirmed = confirm(`Do you want to delete ${contact.firstName} ${contact.lastName} from your contacts?`);
    if (confirmed){
        $.ajax({
            type: 'POST',
            url: './api/deleteContact.php',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                contactId: parseInt(contact.contactId),
            }),
            success: function(response) {
                if (curRendered.length == 1 && curPage > 1){
                    curPage--;
                    $("#page-number").html(curPage);
                }
                getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
            },
            error: function(xhr){
                $(".error-text").html(xhr.responseJSON.message);
            },
        });
    }
}

// Functions for switching pages
function setFirst(){
    curPage = 1;
    $("#page-number").html(curPage);
    getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
}

function setPrevious(){
    if (curPage > 1){
        curPage--;
        $("#page-number").html(curPage);
        getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
    }
}

function setNext(){
    if (curPage < maxPages){
        curPage++;
        $("#page-number").html(curPage);
        getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
    }
}

function setLast(){
    if (curPage != maxPages){
        curPage = maxPages;
        $("#page-number").html(curPage);
        getContacts(curPage, perPage, userId, searchFirstName, searchLastName, searchPhone, searchEmail);
    }
}