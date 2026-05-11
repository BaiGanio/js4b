function showSnackbar(message) {
    var x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show show-index-snackbar";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 40000000);
}
function showAlertSnackbar(message) {
    var x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show show-alert";
    setTimeout(function(){ x.className = x.className.replace("show show-alert", ""); }, 4000);
}
function showSuccessSnackbar(message){
    var x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show show-success";
    setTimeout(function(){ x.className = x.className.replace("show show-success", ""); }, 8000);
}