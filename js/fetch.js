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