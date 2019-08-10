// Set Up Party Pokemon
const partyList = document.getElementById('partyPokemonList');
const setUpParty = (data) => {
    document.getElementById('nameBox').value = '';
    document.getElementById('moveBox1').value = '';
    document.getElementById('moveBox2').value = '';
    document.getElementById('moveBox3').value = '';
    document.getElementById('moveBox4').value = '';
    document.getElementById('opponentNameBox').value = '';
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();

            // Add Pokemon to empty slots
            for (let i = 0; i < docData['party'].length; i++) {
                const nextName = Object.keys(docData['party'][i])[0];
                const idName = 'pokemonName' + [i + 1];
                const idImg = 'pokemonImage' + [i + 1];
                const idSlot = 'partySlot' + [i + 1];
                const xButton = `<button id="delBtn` + [i + 1] + `" class="xBtn" onclick="delPokemon(` + [i + 1] + `)">X</button>`;
                const imgSrc = "Pokemon_Images/" + pokemonNumbers[nextName] + ".png";
                document.getElementById(idName).innerHTML = nextName;
                document.getElementById(idImg).src = imgSrc;
                if (!document.getElementById(idSlot).innerHTML.includes("button")) {
                    document.getElementById(idSlot).innerHTML += xButton;
                }
                const slotName = document.getElementById('partySlot' + [i + 1]);
                slotName.style.visibility = "visible";

                // Add moves to Pokemon Slots
                for (let j = 0; j < 4; j++) {
                    const currMove = docData['party'][i][nextName][j];
                    document.getElementById('poke' + (i + 1) + 'move' + (j + 1)).innerHTML = currMove;
                }
            }

            // Make empty slots blank
            for (let i = docData['party'].length; i < 6; i++) {
                const idName = 'pokemonName' + [i + 1];
                const idImg = 'pokemonImage' + [i + 1];
                document.getElementById(idName).innerHTML = '';
                document.getElementById(idImg).src = '';
                const idSlot = 'partySlot' + [i + 1];
                if (document.getElementById('delBtn' + [i + 1])) {
                    document.getElementById('delBtn' + [i + 1]).remove();
                }
                const slotName = document.getElementById('partySlot' + [i + 1]);
                slotName.style.visibility = "hidden";
            }

            // Add Opponent Pokemon to slot
            // console.log(docData['opponent']);
            if (docData['opponent'] != '') {
                const oppName = docData['opponent'];
                const imgSrc = "Pokemon_Images/" + pokemonNumbers[oppName] + ".png";
                document.getElementById('opponentName').innerHTML = oppName;
                document.getElementById('opponentImage').src = imgSrc;
            }

            // Choose the best move
            chooseMove();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

// Add Pokemon to Party
const addPokemon = document.getElementById('addParty');
let pokemonToAdd = document.getElementById('nameBox');
addPokemon.addEventListener('click', (e) => {
    e.preventDefault();
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    let docData = [];

    // Check to see if the Pokemon entered is a valid Pokemon
    let nameCheck = pokemonToAdd.value;
    if (!pokemonNames.includes(nameCheck)) {
        document.getElementById("validPokemon").innerHTML = "Please enter a valid Pokémon";
        setUpParty();
        return;
    } else {
        document.getElementById("validPokemon").innerHTML = "";
    }

    // Check to see if the moves entered are valid Pokemon moves
    const moves = [document.getElementById('moveBox1').value, document.getElementById('moveBox2').value,
        document.getElementById('moveBox3').value, document.getElementById('moveBox4').value
    ];

    if (moves[0] == '' && moves[1] == '' && moves[2] == '' && moves[3] == '') {
        document.getElementById("validMove").innerHTML = "Please enter at least one move";
        setUpParty();
        return;
    }

    for (let i = 0; i < 4; i++) {
        if (moves[i] != '') {
            if (!pokemonMoves.includes(moves[i])) {
                document.getElementById("validMove").innerHTML = "Move " + [i + 1] + " is not a valid move";
                setUpParty();
                return;
            }
        }
    }

    document.getElementById("validPokemon").innerHTML = "";
    document.getElementById("validMove").innerHTML = "";

    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();
            let newArr = [];
            if (docData['party'].length >= 6) {
                console.log("Party is full");
                document.getElementById('nameBox').value = '';
                document.getElementById('moveBox1').value = '';
                document.getElementById('moveBox2').value = '';
                document.getElementById('moveBox3').value = '';
                document.getElementById('moveBox4').value = '';
                return;
            }
            for (let i = 0; i < docData['party'].length; i++) {
                newArr.push(docData['party'][i]);
            }
            var pokeObj = {};
            let move1 = document.getElementById('moveBox1').value;
            let move2 = document.getElementById('moveBox2').value;
            let move3 = document.getElementById('moveBox3').value;
            let move4 = document.getElementById('moveBox4').value;
            pokeObj[pokemonToAdd.value] = [move1, move2, move3, move4];
            newArr.push(pokeObj);
            // newArr.push(pokemonToAdd.value);
            docRef.update({
                "party": newArr,
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        setUpParty();
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
});

// Add Opponent Pokemon
const addOpponent = document.getElementById('opponentParty');
let opponentToAdd = document.getElementById('opponentNameBox');
addOpponent.addEventListener('click', (e) => {
    e.preventDefault();
    const docRef = db.collection('users').doc(auth.currentUser.uid);

    // Check to see if the Pokemon entered is a valid Pokemon
    let nameCheck = opponentToAdd.value;
    if (!pokemonNames.includes(nameCheck)) {
        document.getElementById("validOpponent").innerHTML = "Please enter a valid Pokémon";
        setUpParty();
        return;
    } else {
        document.getElementById("validOpponent").innerHTML = "";
    }

    docRef.update({
        "opponent": nameCheck
    });

    setUpParty();
});

// Delete Pokemon from Party
function delPokemon(partyNum) {
    let docData = [];
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();
            let newArr = [];
            for (let i = 0; i < docData['party'].length; i++) {
                if (i + 1 != partyNum) {
                    newArr.push(docData['party'][i]);
                }
            }
            docRef.update({
                party: newArr,
            }).then(() => {
                document.getElementById('nameBox').value = '';
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        setUpParty();
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

const getUsercred = (user) => {
    let username = document.getElementById('loginUser');
    if (user) {
        username.innerHTML = user.displayName;
    } else {
        username.innerHTML = '';
    }
}