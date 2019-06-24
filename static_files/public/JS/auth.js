// Signup authentication

// Get Elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const loginBtn = document.getElementById('loginBtn');
const signUpBtn = document.getElementById('signUpBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Create a new user
signUpBtn.addEventListener('click', e => {
  // Keep the page from refreshing when clicked
  e.preventDefault();

  // Get email and pass
  const email = txtEmail.value;
  const pass = txtPassword.value;

  // Create new user
  auth.createUserWithEmailAndPassword(email, pass).then(cred => {
    console.log(cred);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error Code: ", errorCode);
    console.log("Error Message: ", errorMessage);
  });
});


// Sign in an existing user
loginBtn.addEventListener('click', e => {
  // Keep the page from refreshing when clicked
  e.preventDefault();

  // Get email and pass
  const email = txtEmail.value;
  const pass = txtPassword.value;

  // Sign in
  auth.signInWithEmailAndPassword(email, pass).then(cred => {
    console.log(cred);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error Code: ", errorCode);
    console.log("Error Message: ", errorMessage);
  });
});


// Log out a user
logoutBtn.addEventListener('click', e => {
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