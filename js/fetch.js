// =============================================================================
//  JS4B – Data layer
//  Fetch character: Rick & Morty API
//  Like / list liked: local API
// =============================================================================

// ---- Config ----------------------------------------------------------------
var apiUrl             = "http://localhost:3000/api/characters";
var rickAndMortyApiUrl = "https://rickandmortyapi.com/api/character/";

// liked.html pagination state
var allLikedCharacters  = [];
var displayedCharacters = [];
var currentPage = 1;
var pageSize    = 10;

// =============================================================================
//  FETCH a random character  (index.html)
// =============================================================================
function fetchIt() {
    var loaderStart = Date.now();
    var loader = document.querySelector('.loader');
    if (!loader) return;
    loader.style.display = 'block';

    var rings = loader.querySelectorAll('.inner');
    for (var i = 0; i < rings.length; i++) { rings[i].style.animation = 'none'; }
    void loader.offsetHeight;
    for (var i = 0; i < rings.length; i++) { rings[i].style.animation = ''; }

    var rnd = Math.floor(Math.random() * (1000 - 1)) + 1;

    fetch(rickAndMortyApiUrl + rnd)
        .then(function(response) {
            if (!response.ok) throw new Error("API returned " + response.status);
            return response.json();
        })
        .then(function(data) {
            if (data.error) throw new Error(data.error + ". ID: " + rnd + " does not exist.");
            processResponseData(data);
        })
        .catch(function(rmError) {
            console.warn("[js4b] Rick & Morty API failed: " + rmError.message);
            showAlertSnackbar("Cannot fetch character – API unavailable.");
            clearElements();
        })
        .finally(function() {
            var elapsed = Date.now() - loaderStart;
            setTimeout(function() {
                if (loader) loader.style.display = 'none';
            }, Math.max(0, 1000 - elapsed));
        });
}

// =============================================================================
//  LIKE a character  (index.html)
//  Primary: POST to API  |  No fallback – API must be reachable to persist a like
// =============================================================================
function likeIt() {
    var charId  = document.getElementById("heroCharId").innerText;
    var name    = document.getElementById("heroName").innerText;
    var image   = document.getElementById("heroAvatar").src;
    var origin  = document.getElementById("heroOrigin").innerText;
    var species = document.getElementById("heroSpecies").innerText;
    var status  = document.getElementById("heroStatus").innerText;

    var genderEl = document.getElementById("heroGender");
    var typeEl   = document.getElementById("heroType");
    var locEl    = document.getElementById("heroLocation");

    var payload = {
        characterId: charId,
        name:        name,
        avatar:      image,
        origin:      origin,
        species:     species,
        status:      status,
        gender:      genderEl ? genderEl.innerText : "",
        type:        typeEl   ? typeEl.innerText   : "",
        location:    locEl    ? locEl.innerText    : ""
    };

    if (!apiUrl) {
        showSuccessSnackbar("Character liked!");
        return;
    }

    fetch(apiUrl, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(function(response) {
            if (response.status >= 200 && response.status <= 299) return response.json();
            throw new Error("API returned " + response.status);
        })
        .then(function(data) {
            showSuccessSnackbar(data.message || data.title || "Character liked!");
        })
        .catch(function(err) {
            console.warn("[js4b] Like failed: " + err.message);
            showAlertSnackbar("Could not like character – API unavailable.");
            document.getElementById("heroLike").disabled = false;
        });
}

// =============================================================================
//  FETCH liked characters  (liked.html)
// =============================================================================
function fetchLiked() {
    if (typeof $ === 'undefined') {
        console.warn("[js4b] jQuery not available.");
        return;
    }
    $('.loader').show();
    currentPage = 1;

    fetch(apiUrl)
        .then(function(r) {
            if (!r.ok) throw new Error("API returned " + r.status);
            return r.json();
        })
        .then(function(data) {
            allLikedCharacters  = data;
            displayedCharacters = data.slice();
            _renderCurrentPage();
        })
        .catch(function(err) {
            console.warn("[js4b] Liked API failed: " + err.message);
            allLikedCharacters  = [];
            displayedCharacters = [];
            _renderCurrentPage();
        })
        .finally(function() {
            $('.loader').hide();
        });
}

function _renderCurrentPage() {
    var start = (currentPage - 1) * pageSize;
    var slice = displayedCharacters.slice(start, start + pageSize);
    _renderLikedTable(slice);
    _renderPagination(displayedCharacters.length);
}

function _renderPagination(total) {
    var nav = document.getElementById('pagination-nav');
    if (!nav) return;
    var totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) { nav.innerHTML = ''; return; }

    var html = '<ul class="pagination justify-content-center">';
    html += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '">' +
            '<a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ');return false;">&laquo;</a></li>';
    for (var i = 1; i <= totalPages; i++) {
        html += '<li class="page-item' + (i === currentPage ? ' active' : '') + '">' +
                '<a class="page-link" href="#" onclick="changePage(' + i + ');return false;">' + i + '</a></li>';
    }
    html += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '">' +
            '<a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ');return false;">&raquo;</a></li>';
    html += '</ul>';
    nav.innerHTML = html;
}

function changePage(page) {
    var totalPages = Math.ceil(displayedCharacters.length / pageSize);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    _renderCurrentPage();
}

function deleteIt(id) {
    fetch(apiUrl + '/' + id, { method: 'DELETE' })
        .then(function(r) {
            if (!r.ok) throw new Error("API returned " + r.status);
            return r.json();
        })
        .then(function(data) {
            _removeFromState(id);
            if (typeof showSuccessSnackbar === 'function') showSuccessSnackbar(data.message || 'Character removed.');
        })
        .catch(function(err) {
            console.warn("[js4b] Delete failed: " + err.message + " – removing from local view.");
            _removeFromState(id);
        });
}

function _removeFromState(id) {
    function notId(c) { return String(c.characterId || c.charId || c.id || '') !== String(id); }
    allLikedCharacters  = allLikedCharacters.filter(notId);
    displayedCharacters = displayedCharacters.filter(notId);
    var totalPages = Math.ceil(displayedCharacters.length / pageSize);
    if (totalPages === 0) currentPage = 1;
    else if (currentPage > totalPages) currentPage = totalPages;
    _renderCurrentPage();
}

function _renderLikedTable(characters) {
    var elem = $('#table-body');
    elem.empty();
    if (!characters || characters.length === 0) {
        elem.append($('<tr/>').append($('<td colspan="6"/>').text('No liked characters yet.')));
        return;
    }
    characters.forEach(function(element) {
        var charId = element.characterId || element.charId || element.id;
        elem.append(
            $('<tr/>')
                .append($('<th scope="row"></th>').text(charId))
                .append($('<td/>').append($('<img class="avatar-table">').attr('src', element.avatar).attr('onerror', "this.src='images/no-image.jpg'")))
                .append($('<td/>').text(element.name))
                .append($('<td/>').text(element.origin))
                .append($('<td/>').text(element.status))
                .append($('<td/>').append(
                    $('<button class="btn btn-sm btn-danger" title="Remove">').html('<i class="bi bi-trash"></i>').on('click', (function(id) {
                        return function() { deleteIt(id); };
                    })(charId))
                ))
        );
    });
}

// =============================================================================
//  Render fetched character into the hero card  (index.html)
// =============================================================================
function processResponseData(data) {
    document.getElementById("heroCharId").innerText = data.id;
    document.getElementById("heroName").innerText   = data.name;
    document.getElementById("heroAvatar").src       = data.image || data.avatar || "images/no-image.jpg";

    var originText = (typeof data.origin === 'object' && data.origin) ? data.origin.name : (data.origin || "");
    document.getElementById("heroOrigin").innerText  = originText;
    document.getElementById("heroSpecies").innerText = data.species || "";

    var statusEl    = document.getElementById("heroStatus");
    var statusBadge = document.getElementById("heroStatusBadge");
    statusEl.innerText = data.status || "";
    statusEl.className = '';
    statusBadge.classList.remove('badge-alive', 'badge-dead', 'badge-unknown');
    if      (data.status === 'Alive') { statusEl.classList.add('status-alive'); statusBadge.classList.add('badge-alive'); }
    else if (data.status === 'Dead')  { statusEl.classList.add('status-dead');  statusBadge.classList.add('badge-dead');  }
    else                              { statusEl.classList.add('status-unknown'); statusBadge.classList.add('badge-unknown'); }

    var extGender   = document.getElementById("heroGender");
    var extType     = document.getElementById("heroType");
    var extLocation = document.getElementById("heroLocation");
    if (extGender)   extGender.innerText   = data.gender || "—";
    if (extType)     extType.innerText     = data.type   || "—";
    if (extLocation) {
        var loc = (typeof data.location === 'object' && data.location) ? data.location.name : (data.location || "");
        extLocation.innerText = loc || "—";
    }

    document.getElementById("heroLike").disabled = false;

    document.querySelector('.hero-default').style.display = 'none';
    var heroChar = document.querySelector('.hero-character');
    heroChar.style.display = 'block';

    if (heroChar._animEndHandler) {
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    }
    heroChar.classList.remove('hero-char-enter');
    void heroChar.offsetHeight;
    heroChar.classList.add('hero-char-enter');

    heroChar._animEndHandler = function() {
        heroChar.classList.remove('hero-char-enter');
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    };
    heroChar.addEventListener('animationend', heroChar._animEndHandler);
}

// =============================================================================
//  Clear hero card – back to splash  (index.html)
// =============================================================================
function clearElements() {
    document.getElementById("heroCharId").innerText  = "-";
    document.getElementById("heroName").innerText    = "Character Name";
    document.getElementById("heroAvatar").src        = "images/no-image.jpg";
    document.getElementById("heroOrigin").innerText  = "-";
    document.getElementById("heroSpecies").innerText = "-";
    var statusEl = document.getElementById("heroStatus");
    statusEl.innerText = "-";
    statusEl.className = '';
    document.getElementById("heroStatusBadge").classList.remove('badge-alive', 'badge-dead', 'badge-unknown');

    var extGender   = document.getElementById("heroGender");
    var extType     = document.getElementById("heroType");
    var extLocation = document.getElementById("heroLocation");
    if (extGender)   extGender.innerText   = "-";
    if (extType)     extType.innerText     = "-";
    if (extLocation) extLocation.innerText = "-";

    document.getElementById("heroLike").disabled = true;

    var heroChar = document.querySelector('.hero-character');
    if (heroChar._animEndHandler) {
        heroChar.removeEventListener('animationend', heroChar._animEndHandler);
        heroChar._animEndHandler = null;
    }
    heroChar.classList.remove('hero-char-enter');
    heroChar.style.display = 'none';
    document.querySelector('.hero-default').style.display = 'block';
}
