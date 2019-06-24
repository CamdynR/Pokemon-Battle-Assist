// (function() {

  /*
  // jQuery convention for running when the document has been fully loaded:
  $(document).ready(() => {
    const database = firebase.database();

    $('#resetButton').click(() => {
      console.log('Resetting the database');

      database.ref('users/').remove(); // delete the entire collection

      // writes data to the database:
      database.ref('users/Philip').set({job: 'professor', pet: 'cat.jpg'});
      database.ref('users/John').set({job: 'student',   pet: 'dog.jpg'});
      database.ref('users/Carol').set({job: 'engineer',  pet: 'bear.jpg'});
    });

    // use .on('value' to get notified in real-time whenever anyone
    // on the internet updates your database. cool!
    database.ref('users/').on('value', (snapshot) => {
      const allUsers = snapshot.val();
      console.log('users/ changed:', allUsers);
      if (allUsers) {
        $('#status').html(''); // clear the HTML
        $('#status').append('List of users:');
        Object.keys(allUsers).forEach((name) => {
          $('#status').append('<li>' + name + ' ' + allUsers[name].job + ' ' + allUsers[name].pet + '</li>');
        });
      }
    });

    $('#readButton').click(() => {
      const key = 'users/' + $('#nameBox').val();

      // 'once' reads the value once from the database
      database.ref(key).once('value', (snapshot) => {
        const data = snapshot.val();

        console.log('You received some data!', data);
        if (!data) {
          // clear the display
          $('#jobDiv').html('');
          $('#petImage').attr('src', '').attr('width', '0px');
          $('#status').html('Error: could not find user: ' + key);
          return;
        }

        if (data.job && data.pet) {
          $('#jobDiv').html('My job is ' + data.job);
          $('#petImage').attr('src', data.pet).attr('width', '300px');
        } else {
          // clear the display
          $('#jobDiv').html('');
          $('#petImage').attr('src', '').attr('width', '0px');
        }
      });
    });

    $('#allUsersButton').click(() => {
      database.ref('users/').once('value', (snapshot) => {
        const data = snapshot.val();
        console.log('You received some data!', data);
        $('#status').html('All users: ' + Object.keys(data));
      });
    });

    $('#insertButton').click(() => {
      const name = $('#insertNameBox').val();
      database.ref('users/' + name).set({
        job: $('#insertJobBox').val(),
        pet: $('#insertPetBox').val()
      });
    });

    $('#deleteButton').click(() => {
      const name = $('#deleteNameBox').val();
      database.ref('users/' + name).remove();
    });
  });
  */

// }());