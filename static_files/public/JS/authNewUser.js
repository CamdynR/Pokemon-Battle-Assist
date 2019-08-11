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
    // Keep the page from refreshing when clicked
    e.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        // var email = user.email;

        var user = result.user;

        return db.collection('users').doc(user.uid).set({
            party: {}
        });

    }).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;

        console.log("Error Code:", errorCode);
        console.log(errorMessage);
    });

});

// Create a new Facebook User
facebookSignInBtn.addEventListener('click', e => {
    // Keep the page from refreshing when clicked
    e.preventDefault();

    var provider = new firebase.auth.FacebookAuthProvider();

    auth.signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
        }
        // The signed-in user info.
        var user = result.user;
        return db.collection('users').doc(user.uid).set({
            party: {}
        });
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;

        console.log("Error Code:", errorCode);
        console.log(errorMessage);
    });

    /*
    auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info;
        // var email = user.email;
        var user = result.user;

        return db.collection('users').doc(user.uid).set({
            party: {}
        });

    }).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;

        console.log("Error Code:", errorCode);
        console.log(errorMessage);
    });
    */

});