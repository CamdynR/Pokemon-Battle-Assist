// Signup authentication

// Listen for auth status changes
auth.onAuthStateChanged(user => {
  if(user) {
    console.log('User logged in: ', user);
  } else {
    console.log('User logged out');
    if(!location.href.includes("login.html")) {
      console.log("test");
      location.href = "/public/HTML/login.html";
    }
  }
});

// Get Elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');


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
    location.href = "../../index.html";
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error Code: ", errorCode);
    console.log("Error Message: ", errorMessage);
  });
});