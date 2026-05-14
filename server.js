const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 3000;
const DB_FILE  = path.join(__dirname, 'files', 'characters.json');

app.use(express.json());
app.use(express.static(__dirname));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

function readCharacters() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function writeCharacters(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4), 'utf8');
}

// GET /api/characters – return all liked characters
app.get('/api/characters', function(req, res) {
    res.json(readCharacters());
});

// POST /api/characters – add a liked character (ignore duplicates)
app.post('/api/characters', function(req, res) {
    var characters = readCharacters();
    var incoming   = req.body;

    var exists = characters.some(function(c) {
        return String(c.characterId) === String(incoming.characterId);
    });

    if (exists) {
        return res.status(409).json({ message: 'Character already liked.' });
    }

    characters.push(incoming);
    writeCharacters(characters);
    res.status(201).json({ message: 'Character liked!' });
});

// DELETE /api/characters/:id – remove a liked character
app.delete('/api/characters/:id', function(req, res) {
    var characters = readCharacters();
    var filtered   = characters.filter(function(c) {
        return String(c.characterId) !== String(req.params.id);
    });

    if (filtered.length === characters.length) {
        return res.status(404).json({ message: 'Character not found.' });
    }

    writeCharacters(filtered);
    res.json({ message: 'Character removed.' });
});

app.listen(PORT, function() {
    console.log('[js4b] Server running at http://localhost:' + PORT);
});
