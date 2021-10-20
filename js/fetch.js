// var url = "https://characters-api.azurewebsites.net/api/characters/"
var url = "https://localhost:44321/api/Characters/"
function fetchIt(){
    var rnd = Math.floor(Math.random() * (1000 - 1)) + 1;
    document.getElementById("charRndId").innerText = rnd;
    url +=  rnd;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        if(data.error){
            showAlertSnackbar(data.error);
            clearElements();
        }else{
            processResponseData(data);
        }
    })
    .catch(error => showAlertSnackbar(error));
}

function saveIt(){
    var params = {
        CharId: document.getElementById("charId").innerText,
        Name: document.getElementById("name").innerText,
        Avatar : document.getElementById("avatar").src,
        Origin : document.getElementById("origin").innerText,
        Species : document.getElementById("species").innerText,
        Status : document.getElementById("status").innerText
    };
    
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify( params )  
    };

    fetch(url, options)
    .then((response) => {
        if(response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error("Character already saved.");
        }
    })
    .then(data => showSuccessSnackbar('Successfully added character'))
    .catch(error => {
        document.getElementById("save").disabled = true;
        showAlertSnackbar(error);
    });
}

function likeIt(id){
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT', 
        body: JSON.stringify({Id: id} ) 
    };

    fetch(url + 'update/', options)
    .then((response) => {
        if(response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error("Filed to update characterwith id: " + id);
        }
    })
    .then(data => showSuccessSnackbar('Successfully liked character'))
    .catch(error => {
        // document.getElementById("save").disabled = true;
        showAlertSnackbar(error);
    });
}

function processResponseData(data){
    document.getElementById("charId").innerText = data.id;
    document.getElementById("name").innerText = data.name;
    document.getElementById("avatar").src = data.image;
    document.getElementById("origin").innerText = data.origin.name;
    document.getElementById("species").innerText = data.species;
    document.getElementById("status").innerText = data.status;

    document.getElementById("save").disabled = false;
}

function clearElements(){
    document.getElementById("charId").innerText = "N/A";
    document.getElementById("name").innerText =  "N/A";
    document.getElementById("avatar").src = "images/no-image.jpg";
    document.getElementById("origin").innerText =  "N/A";
    document.getElementById("species").innerText =  "N/A";
    document.getElementById("status").innerText =  "N/A";

    document.getElementById("save").disabled = true;
}