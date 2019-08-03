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
        // setUpParty([]);
        if (!location.href.includes("newUser.html")) {
            location.href = "/public/HTML/newUser.html";
        }
    }
});

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

const logoutBtnIndex = document.getElementById('logoutBtnIndex');

// Log out a user on the main logout page
logoutBtnIndex.addEventListener('click', e => {
    // Keep the page from refreshing when clicked
    e.preventDefault();

    auth.signOut().then(function() {
        // Sign-out successful.
        console.log("Successfully logged out");
        location.href = "/public/HTML/newUser.html";
    }).catch(function(error) {
        // An error happened.
        console.log("Error: ", error);
    });
});