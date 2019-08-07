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

// Log out a user on the main logout page
const logoutBtnIndex = document.getElementById('logoutBtnIndex');
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