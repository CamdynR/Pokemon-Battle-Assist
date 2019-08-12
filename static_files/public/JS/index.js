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
                // slotName.style.visibility = "visible";
                slotName.style.display = "inline-block";
                document.getElementById("delBtn" + [i + 1]).style.visibility = "visible";

                // Add moves to Pokemon Slots
                let linesToAdd = 0;
                for (let j = 0; j < 4; j++) {
                    const currMove = docData['party'][i][nextName][j];
                    document.getElementById('poke' + (i + 1) + 'move' + (j + 1)).innerHTML = currMove;
                    linesToAdd += Math.floor((currMove.length / 13));
                }

                // Extend Slot Length for move height
                idSlotHeight = document.getElementById(idSlot);
                idSlotHeight.style.height = 195 + (17 * linesToAdd) + "px";
            }

            // Make empty slots blank
            for (let i = Object.keys(docData['party']).length; i < 6; i++) {
                const idName = 'pokemonName' + [i + 1];
                const idImg = 'pokemonImage' + [i + 1];
                document.getElementById(idName).innerHTML = '';
                document.getElementById(idImg).src = '';
                const idSlot = 'partySlot' + [i + 1];
                if (document.getElementById('delBtn' + [i + 1])) {
                    document.getElementById('delBtn' + [i + 1]).remove();
                }
                const slotName = document.getElementById('partySlot' + [i + 1]);
                // slotName.style.visibility = "hidden";
                slotName.style.display = "none";
            }

            // Add Opponent Pokemon to slot
            if (docData['opponent']) {
                const oppName = docData['opponent'];
                const imgSrc = "Pokemon_Images/" + pokemonNumbers[oppName] + ".png";
                document.getElementById('opponentName').innerHTML = oppName;
                document.getElementById('opponentImage').src = imgSrc;
            }

            // Choose the best move
            chooseMove();

            // Remove move choice if party is empty
            document.getElementById('answerImage').src = "";
            document.getElementById('answerName').innerHTML = "";
            document.getElementById('answerMove').innerHTML = "";

            // Add the X button if editing
            if (editParty.innerHTML == "Done Editing") {
                const xBtn = document.getElementsByClassName("xBtn");
                for (let i = 0; i < xBtn.length; i++) {
                    xBtn[i].style.visibility = "visible";
                }
            }

            // Hide the X if not editing
            if (document.getElementById('editParty').innerHTML == "<h3>Edit Party</h3>") {
                const xBtn = document.getElementsByClassName("xBtn");
                for (let i = 0; i < xBtn.length; i++) {
                    xBtn[i].style.visibility = "hidden";
                }
            }

            // Moves the Add Pokemon input
            const partyParent = document.getElementById('editPartyParent');
            const addForm = document.getElementById('addForm');
            const editPartyBtn = document.getElementById('editParty');
            if (docData['party'].length < 6 && editPartyBtn.innerHTML != "<h3>Edit Party</h3>") {
                partyParent.style.display = "inline-block";
                // Screen Media Query
                if (screen.width > 1011) {
                    partyParent.style.gridColumn = (docData['party'].length + 1);
                    partyParent.style.gridRow = 1;
                } else {
                    let tempCol = (docData['party'].length + 1) % 3;
                    if (tempCol == 0) {
                        tempCol = 3;
                    }
                    partyParent.style.gridColumn = tempCol;
                    partyParent.style.gridRow = (Math.floor(docData['party'].length / 3)) + 1;
                }
                document.getElementById('nameBox').focus();
            } else {
                // Screen Media Query
                if (screen.width > 1011) {
                    partyParent.style.gridColumn = 1;
                    partyParent.style.gridRow = 2;
                } else {
                    partyParent.style.gridColumn = 1;
                    partyParent.style.gridRow = 3;
                }
                partyParent.style.display = "none";
            }
        } else {
            // doc.data() will be undefined in this case
            db.collection('users').doc(auth.currentUser.uid).set({
                party: {}
            });
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

// Displays the current User's name in the upper right
const getUsercred = (user) => {
    let username = document.getElementById('loginUser');
    if (user) {
        username.innerHTML = user.displayName;
    } else {
        username.innerHTML = '';
    }
}

// Adds the input form for new pokemon when clicked
document.getElementById('editParty');
editParty.addEventListener('click', (e) => {
    e.preventDefault();

    setUpParty();
    if (editParty.innerHTML == "<h3>Edit Party</h3>") {
        editParty.innerHTML = "<h3 style=\"margin-left:16px;\">Done</h3>";

        const xBtn = document.getElementsByClassName("xBtn");
        for (let i = 0; i < xBtn.length; i++) {
            xBtn[i].style.visibility = "visible";
        }
    } else {
        editParty.innerHTML = "<h3>Edit Party</h3>";

        const xBtn = document.getElementsByClassName("xBtn");
        for (let i = 0; i < xBtn.length; i++) {
            xBtn[i].style.visibility = "hidden";
        }
    }
});