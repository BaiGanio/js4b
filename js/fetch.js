function fetchIt(url){
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

function saveIt(url){
    var avatar = document.getElementById("avatar").src;
    var origin = document.getElementById("origin").innerText;
    var species = document.getElementById("species").innerText;
    var status = document.getElementById("status").innerText;

    var data = {
        CharId: document.getElementById("charId").innerText,
        Name: document.getElementById("name").innerText,
        Avatar : avatar,
        Origin : origin,
        Species : species,
        Status : status
    };
    console.log(data );
    var options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify( data )  
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