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
                    if (!currMove.includes(" ")) {
                        linesToAdd += Math.floor((currMove.length / 13));
                    } else {
                        linesToAdd += Math.floor((currMove.length / 12));
                    }
                }

                // Extend Slot Length for move height
                idSlotHeight = document.getElementById(idSlot);
                idSlotHeight.style.height = 195 + (17 * linesToAdd) + "px";
                if (screen.width < 450) {
                    idSlotHeight.style.height = 205 + (17 * linesToAdd) + "px";
                }
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
                // Screen Media Query for large screens
                if (screen.width > 1023) {
                    partyParent.style.gridColumn = (docData['party'].length + 1);
                    partyParent.style.gridRow = 1;
                    document.getElementById('nameBox').focus();
                    // Screen Media Query for tablets
                } else if (screen.width > 574) {
                    let tempCol = (docData['party'].length + 1) % 3;
                    if (tempCol == 0) {
                        tempCol = 3;
                    }
                    partyParent.style.gridColumn = tempCol;
                    partyParent.style.gridRow = (Math.floor(docData['party'].length / 3)) + 1;
                    document.getElementById('nameBox').focus();
                    // Screen Media Query for Phones
                } else {
                    partyParent.style.gridColumn = "1 / span 2";
                    partyParent.style.gridRow = 1;
                }
            } else {
                // Screen Media Query for large screens
                if (screen.width > 1023) {
                    partyParent.style.gridColumn = 1;
                    partyParent.style.gridRow = 2;
                    // Screen Media Query for tablets
                } else if (screen.width > 574) {
                    partyParent.style.gridColumn = 1;
                    partyParent.style.gridRow = 3;
                    // Screen Media Query for Phones
                } else {
                    partyParent.style.gridColumn = 1;
                    partyParent.style.gridRow = 4;
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

    // Checks to see if if at least one move was entered
    if (moves[0] == '' && moves[1] == '' && moves[2] == '' && moves[3] == '') {
        document.getElementById("validMove").innerHTML = "Please enter at least one move";
        setUpParty();
        return;
    }

    // Checks to see if every move entered was valid
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

    // Connects to firebase and adds in the entered pokemon/moves
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();

            // Check to see if the party isn't full
            if (docData['party'].length >= 6) {
                console.log("Party is full");
                document.getElementById('nameBox').value = '';
                document.getElementById('moveBox1').value = '';
                document.getElementById('moveBox2').value = '';
                document.getElementById('moveBox3').value = '';
                document.getElementById('moveBox4').value = '';
                return;
            }

            // Create a new array and add the current Firebase party to it
            let newArr = [];
            for (let i = 0; i < docData['party'].length; i++) {
                newArr.push(docData['party'][i]);
            }


            // Create a new object for the entered Pokemon and append to party array
            var pokeObj = {};
            let move1 = document.getElementById('moveBox1').value;
            let move2 = document.getElementById('moveBox2').value;
            let move3 = document.getElementById('moveBox3').value;
            let move4 = document.getElementById('moveBox4').value;
            pokeObj[pokemonToAdd.value] = [move1, move2, move3, move4];
            newArr.push(pokeObj);

            // Push the updated party to Firebase
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

    if (screen.width <= 415) {
        $('html,body').scrollTop(0);
        $('opponentNameBox').blur();
    }

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
const editParty = document.getElementById('editParty');
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


// Makes the menu pop-down for the hamburger menu
const menuButton = document.getElementById('mobileMenuBtn');
menuButton.addEventListener('click', (e) => {
    e.preventDefault();

    const mobileParent = document.getElementById('mobileMenuParent');
    const loginUser = document.getElementById('loginUser');
    const logoutBtnIndex = document.getElementById('logoutBtnIndex');
    if (mobileParent.style.height == "50px" || mobileParent.style.height == "") {
        mobileParent.style.height = "120px";
        menuButton.style.marginTop = "68px";
        loginUser.style.display = "inline-block";
        logoutBtnIndex.style.display = "inline-block";
    } else {
        mobileParent.style.height = "50px";
        menuButton.style.marginTop = "0px";
        loginUser.style.display = "none";
        logoutBtnIndex.style.display = "none";
    }

    var scroll = $(window).scrollTop();
    if ($("#mobileMenuParent").hasClass("active") && scroll == 0) {
        $("#mobileMenuParent").removeClass("active");
    } else {
        $("#mobileMenuParent").addClass("active");
    }
});

// Add dropshadow to mobile header when scrolled
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    const mobileParent = document.getElementById('mobileMenuParent');
    if (scroll > 0) {
        $("#mobileMenuParent").addClass("active");
    } else if (scroll == 0 && mobileParent.style.height != "120px") {
        $("#mobileMenuParent").removeClass("active");
    }
});