const partyList = document.getElementById('partyPokemonList');

// Set Up Party Pokemon
const setUpParty = (data) => {
    let html = '';

    const docRef = db.collection('users').doc(auth.currentUser.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docData = doc.data();
            for (let i = 0; i < docData['party'].length; i++) {
                const li = `
                    <li>${docData['party'][i]}</li>
                `;
                html += li;
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        partyList.innerHTML = html;
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