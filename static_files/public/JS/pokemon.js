// Picks the pokemon and move to use
// against the opponent
function chooseMove() {
    const ultraEffectiveTypes = [];
    const superEffectiveTypes = [];
    const regEffectiveTypes = [];
    const notEffectiveTypes = [];
    const superNotEffectiveTypes = [];
    const listOfTypes = [];
    const moveList = {};
    let finalMovePick = "";
    let finalPokemonPick = "";
    const returnVal = [];
    const docRef = db.collection('users').doc(auth.currentUser.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {

            // Get the moves and their types
            docData = doc.data();
            for (let i = 0; i < docData['party'].length; i++) {
                const nextName = Object.keys(docData['party'][i])[0];
                for (let j = 0; j < 4; j++) {
                    const currMove = docData['party'][i][nextName][j];
                    if (currMove != "" && moveTypes[1][currMove] != "Status") {
                        const type = moveTypes[0][currMove];
                        const powerAndMove = {};
                        powerAndMove[moveTypes[2][currMove]] = currMove;
                        if (type in moveList) {
                            moveList[type].push(powerAndMove);
                        } else {
                            moveList[type] = [powerAndMove];
                        }
                        listOfTypes.push(type);
                    }
                }
            }

            // Get which types are super effective
            const oppName = docData['opponent'];
            const oppNum = pokemonNumbers[oppName] - 1;
            for (var key in data[oppNum]) {
                if (key != "name" && key != "pokedex_number") {
                    if (data[oppNum][key] == 4) {
                        var typeWeak = key.substr(8);
                        typeWeak = typeWeak.charAt(0).toUpperCase() + typeWeak.slice(1);
                        ultraEffectiveTypes.push(typeWeak);
                    } else if (data[oppNum][key] == 2) {
                        var typeWeak = key.substr(8);
                        typeWeak = typeWeak.charAt(0).toUpperCase() + typeWeak.slice(1);
                        superEffectiveTypes.push(typeWeak);
                    } else if (data[oppNum][key] == 1) {
                        var typeWeak = key.substr(8);
                        typeWeak = typeWeak.charAt(0).toUpperCase() + typeWeak.slice(1);
                        regEffectiveTypes.push(typeWeak);
                    } else if (data[oppNum][key] == 0.5) {
                        var typeWeak = key.substr(8);
                        typeWeak = typeWeak.charAt(0).toUpperCase() + typeWeak.slice(1);
                        notEffectiveTypes.push(typeWeak);
                    } else {
                        var typeWeak = key.substr(8);
                        typeWeak = typeWeak.charAt(0).toUpperCase() + typeWeak.slice(1);
                        superNotEffectiveTypes.push(typeWeak);
                    }
                }
            }

            // See if there are any ultra effective moves
            const ultraEffective = findEffectiveMove(ultraEffectiveTypes, listOfTypes, moveList);
            if (ultraEffective != "") { finalMovePick = ultraEffective }

            // See if there are any super effective moves
            if (finalMovePick == "") {
                const superEffective = findEffectiveMove(superEffectiveTypes, listOfTypes, moveList);
                if (superEffective != "") { finalMovePick = superEffective }
            }

            // See if there are any regularly effective moves
            if (finalMovePick == "") {
                const regEffective = findEffectiveMove(regEffectiveTypes, listOfTypes, moveList);
                if (regEffective != "") { finalMovePick = regEffective }
            }

            // See if there are any not effective moves
            if (finalMovePick == "") {
                const notEffective = findEffectiveMove(notEffectiveTypes, listOfTypes, moveList);
                if (notEffective != "") { finalMovePick = notEffective }
            }

            // See if there are any super not effective moves
            if (finalMovePick == "") {
                const superNotEffective = findEffectiveMove(superNotEffectiveTypes, listOfTypes, moveList);
                if (superNotEffective != "") { finalMovePick = superNotEffective }
            }

            for (let i = 0; i < docData['party'].length; i++) {
                const nextName = Object.keys(docData['party'][i])[0];
                for (let j = 0; j < 4; j++) {
                    if (docData['party'][i][nextName][j] == finalMovePick) {
                        finalPokemonPick = nextName;
                        break;
                    }
                }
            }

            const answerImg = "Pokemon_Images/" + pokemonNumbers[finalPokemonPick] + ".png";
            document.getElementById('answerImage').src = answerImg;
            document.getElementById('answerName').innerHTML = finalPokemonPick;
            document.getElementById('answerMove').innerHTML = finalMovePick;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

// Helper function to find the largest number in an array of Strings
function findMaxString(inputArray) {
    let maxString = inputArray[0];
    for (let i = 1; i < inputArray.length; i++) {
        if (Number(inputArray[i] > Number(maxString))) {
            maxString = inputArray[i];
        }
    }
    return maxString;
}

// Helper method to pick the best move for the given list of moves
function findEffectiveMove(effectiveArray, listOfTypes, moveList) {
    if (effectiveArray.length == 0) {
        return "";
    }
    for (let i = 0; i < effectiveArray.length; i++) {
        if (listOfTypes.includes(effectiveArray[i])) {
            const listOfPower = [];
            for (let j = 0; j < moveList[effectiveArray[i]].length; j++) {
                listOfPower.push(Object.keys(moveList[effectiveArray[i]][j])[0]);
            }
            const highestValue = findMaxString(listOfPower);
            for (let k = 0; k < moveList[effectiveArray[i]].length; k++) {
                if (Object.keys(moveList[effectiveArray[i]][k])[0] == highestValue) {
                    return moveList[effectiveArray[i]][k][highestValue];
                }
            }
        }
    }
    return "";
}