var apiUrl = "https://test-bgapi.azurewebsites.net/api/characters/";
var apiUrl1 = "https://localhost:44364/api/characters/"
var rickAndMortyApiUrl = "https://rickandmortyapi.com/api/character/";

function fetchIt(){    
    let rnd = Math.floor(Math.random() * (1000 - 1)) + 1;
    
    document.querySelector('.loader').style.display = 'block';
    
    fetch(rickAndMortyApiUrl + rnd)
    .then(response => response.json())
    .then((data) => {
        if(data.error){
            showAlertSnackbar(data.error + `. ID: ${rnd} does not exist in Rick and Morty API database.`);
            clearElements();
        }else{
            processResponseData(data);
        }
    })
    .catch(error => showAlertSnackbar(error));
}

function saveIt(){
    document.getElementById("save").disabled = true;
    const params = {
        CharacterId: document.getElementById("charId").innerText,
        Name: document.getElementById("name").innerText,
        Avatar : document.getElementById("avatar").src,
        Origin : document.getElementById("origin").innerText,
        Species : document.getElementById("species").innerText,
        Status : document.getElementById("status").innerText
    };
    
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify( params )  
    };
    fetch(apiUrl, options).then((response) => {
        if(response.status >= 200 && response.status <= 299) { return response.json(); } 
        else { throw Error("Character already saved."); }
    })
    .then(data => {showSuccessSnackbar(data)})
    .catch(error => { showAlertSnackbar(error); });
}

function likeIt(element){
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT', 
        body: JSON.stringify({Id: element.id}) 
    };

    fetch(apiUrl + 'update/', options)
    .then((response) => {
        if(response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error("Filed to update character with id: " + element.id);
        }
    })
    .then(data => {
        showSuccessSnackbar(data);
    })
    .catch(error => {
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