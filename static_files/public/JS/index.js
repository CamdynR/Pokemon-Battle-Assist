// Set Up Party Pokemon
const partyList = document.getElementById('partyPokemonList');
const setUpParty = (data) => {
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();
            for (let i = 0; i < docData['party'].length; i++) {
                const nextName = docData['party'][i];
                const idName = 'pokemonName' + [i + 1];
                const idSlot = 'partySlot' + [i + 1];
                const xButton = `<button id="delBtn` + [i + 1] + `" class="xBtn" onclick="delPokemon(` + [i + 1] + `)">X</button>`;
                document.getElementById(idName).innerHTML = nextName;
                if (!document.getElementById(idSlot).innerHTML.includes("button")) {
                    document.getElementById(idSlot).innerHTML += xButton;
                }
            }
            for (let i = docData['party'].length; i < 6; i++) {
                const idName = 'pokemonName' + [i + 1];
                document.getElementById(idName).innerHTML = '';
                const idSlot = 'partySlot' + [i + 1];
                if (document.getElementById('delBtn' + [i + 1])) {
                    document.getElementById('delBtn' + [i + 1]).remove();
                }
            }
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
const pokemonToAdd = document.getElementById('nameBox');
addPokemon.addEventListener('click', (e) => {
    e.preventDefault();
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    let docData = [];

    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();
            let newArr = [];
            if (docData['party'].length == 6) {
                console.log("Party is full");
                pokemonToAdd.value = '';
                return;
            }
            for (let i = 0; i < docData['party'].length; i++) {
                newArr.push(docData['party'][i]);
            }
            newArr.push(pokemonToAdd.value);
            docRef.set({
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
            docRef.set({
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
    let email = user.email;
    let name = email.substring(0, email.lastIndexOf("@"));
    if (user) {
        username.innerHTML = name;
    } else {
        username.innerHTML = '';
    }
}