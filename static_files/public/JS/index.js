const partyList = document.getElementById('partyPokemonList');

// Set Up Party Pokemon
const setUpParty = (data) => {
    let html = '';
    data.forEach(doc => {
        const pokemon = doc.data();
        console.log(pokemon);
        for (const key in pokemon) {
            const li = `
             <li>${pokemon[key]}</li>
            `;
            html += li;
        }
    });

    partyList.innerHTML = html;
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