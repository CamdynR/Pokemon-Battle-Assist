// Listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in: ', user);
        location.href = "../../index.html";
    } else {
        console.log('Please log in');
    }
});

// Create new Google User
googleSignInBtn.addEventListener('click', e => {
    console.log("google sign in");
    // Keep the page from refreshing when clicked
    e.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);

        var email = user.email;
        console.log(email);

        return db.collection('users').doc(user.uid).set({
            party: {}
        });

    }).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        console.log(errorMessage);
    });

});