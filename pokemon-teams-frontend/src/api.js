/********** FETCHES **********/
function getAllTrainers(url) {
    return fetch(url)
        .then(response => response.json())
}

function createPokemon(url, trainerId) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ "trainer_id": trainerId})
    })
        .then(response => response.json())
}

function deletePokemon(url) {
    return fetch(`${url}`, {
        method: "DELETE"
    })
        .then(response => response.json())
}