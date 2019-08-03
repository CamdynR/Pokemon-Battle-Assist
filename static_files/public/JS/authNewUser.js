// Listen for auth status changes
/*
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in: ', user);
        location.href = "/index.html";
    } else {
        console.log('User logged out');
    }
});
*/

const txtEmail = document.getElementById('txtEmail');
const txtPassword1 = document.getElementById('txtPassword1');
const txtPassword2 = document.getElementById('txtPassword2');
const signUpBtn = document.getElementById('signUpBtn');
const passMatch = document.getElementById('passMatch');

// Create a new user
signUpBtn.addEventListener('click', e => {
    // Keep the page from refreshing when clicked
    e.preventDefault();

    if (txtPassword1.value != txtPassword2.value) {
        passMatch.innerHTML = "The passwords do no match";
    } else {
        passMatch.innerHTML = "";

        // Get email and pass
        const email = txtEmail.value;
        const pass = txtPassword1.value;

        // Create new user
        auth.createUserWithEmailAndPassword(email, pass).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                party: []
            });
            // }).catch(function(error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // console.log("Error Code: ", errorCode);
            // console.log("Error Message: ", errorMessage);
        }).then(() => {
            console.log("testphrase");
            location.href = "../../index.html";
        });
    }
});