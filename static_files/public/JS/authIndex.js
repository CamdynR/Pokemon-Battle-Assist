// Listen for auth status changes
auth.onAuthStateChanged(user => {
  if(user) {
    console.log('User logged in: ', user);
  } else {
    console.log('User logged out');
    if(!location.href.includes("newUser.html")) {
      console.log("test");
      location.href = "/public/HTML/newUser.html";
    }
  }
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