var apiUrl = "https://test-bgapi.azurewebsites.net/api/characters/";
var apiUrl1 = "https://localhost:44364/api/characters/"
var rickAndMortyApiUrl = "https://rickandmortyapi.com/api/character/";

function fetchIt(){    
    let rnd = Math.floor(Math.random() * (1000 - 1)) + 1;
    
    var loaderStart = Date.now();
    var loader = document.querySelector('.loader');
    loader.style.display = 'block';
    // Force CSS animation restart (animations freeze after display:none)
    var rings = loader.querySelectorAll('.inner');
    for (var i = 0; i < rings.length; i++) {
        rings[i].style.animation = 'none';
    }
    void loader.offsetHeight;
    for (var i = 0; i < rings.length; i++) {
        rings[i].style.animation = '';
    }
    
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
    .catch(error => showAlertSnackbar(error))
    .finally(() => {
        var elapsed = Date.now() - loaderStart;
        var remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, remaining);
    });
}

function saveIt(){
    document.getElementById("heroSave").disabled = true;
    const params = {
        CharacterId: document.getElementById("heroCharId").innerText,
        Name: document.getElementById("heroName").innerText,
        Avatar : document.getElementById("heroAvatar").src,
        Origin : document.getElementById("heroOrigin").innerText,
        Species : document.getElementById("heroSpecies").innerText,
        Status : document.getElementById("heroStatus").innerText
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
    // Populate hero character card
    document.getElementById("heroCharId").innerText = data.id;
    document.getElementById("heroName").innerText = data.name;
    document.getElementById("heroAvatar").src = data.image;
    document.getElementById("heroOrigin").innerText = data.origin.name;
    document.getElementById("heroSpecies").innerText = data.species;

    var statusEl = document.getElementById("heroStatus");
    statusEl.innerText = data.status;
    statusEl.className = 'hero-badge-value';
    if (data.status === 'Alive') {
        statusEl.classList.add('status-alive');
    } else if (data.status === 'Dead') {
        statusEl.classList.add('status-dead');
    } else {
        statusEl.classList.add('status-unknown');
    }

    document.getElementById("heroSave").disabled = false;

    // Switch from default hero to character card
    document.querySelector('.hero-default').style.display = 'none';
    var heroChar = document.querySelector('.hero-character');
    heroChar.style.display = 'block';

    // Trigger entrance animation via class (NOT inline style,
    // so theme-switch animation-duration kills won't interfere).
    // Remove any stale listener from a previous rapid fetch.
    if (heroChar._animEndHandler) {
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    }
    heroChar.classList.remove('hero-char-enter');
    void heroChar.offsetHeight;  // force reflow to restart animation
    heroChar.classList.add('hero-char-enter');

    // Clean up the animation class after it finishes
    heroChar._animEndHandler = function() {
        heroChar.classList.remove('hero-char-enter');
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    };
    heroChar.addEventListener('animationend', heroChar._animEndHandler);
}

function clearElements(){
    // Reset hero character card fields
    document.getElementById("heroCharId").innerText = "-";
    document.getElementById("heroName").innerText = "Character Name";
    document.getElementById("heroAvatar").src = "images/no-image.jpg";
    document.getElementById("heroOrigin").innerText = "-";
    document.getElementById("heroSpecies").innerText = "-";
    document.getElementById("heroStatus").innerText = "-";
    document.getElementById("heroStatus").className = 'hero-badge-value';

    document.getElementById("heroSave").disabled = true;

    // Switch back to default hero splash
    var heroChar = document.querySelector('.hero-character');
    if (heroChar._animEndHandler) {
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    }
    heroChar.classList.remove('hero-char-enter');
    heroChar.style.display = 'none';
    document.querySelector('.hero-default').style.display = 'block';
}
