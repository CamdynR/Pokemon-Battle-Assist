// Listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        // console.log('User logged in: ', user);
        // Get Data
        db.collection('party').onSnapshot(snapshot => {
            setUpParty(snapshot.docs);
            getUsercred(user);
        }, err => {
            console.log(err.message);
        });
    } else {
        console.log('User logged out');
        setUpParty([]);
        if (!location.href.includes("newUser.html")) {
            console.log("test");
            location.href = "/public/HTML/newUser.html";
        }
    }
});

// Add Pokemon to Party
const addPokemon = document.getElementById('addParty');
const pokemonToAdd = document.getElementById('nameBox');
addPokemon.addEventListener('click', (e) => {
    e.preventDefault();
    db.collection('party').add({
        first: pokemonToAdd.value,
    }).then(() => {
        console.log('Added', pokemonToAdd.value, 'to the party collection');
        document.getElementById('nameBox').value = '';
    }).catch(err => {
        console.log(err.message);
    });

});

const logoutBtnIndex = document.getElementById('logoutBtnIndex');

// Log out a user on the main logout page
logoutBtnIndex.addEventListener('click', e => {
    // Keep the page from refreshing when clicked
    e.preventDefault();

    auth.signOut().then(function() {
        // Sign-out successful.
        console.log("Successfully logged out");
    }).catch(function(error) {
        // An error happened.
        console.log("Error: ", error);
    });
});