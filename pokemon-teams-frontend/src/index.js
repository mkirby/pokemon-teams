// DOM ELEMENTS
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainBody = document.querySelector('main')

// ✅ When a user loads the page, they should see all trainers, with their current team of Pokemon.
// ✅ Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
// ✅ Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.

// EVENT LISTENERS
mainBody.addEventListener("click", event => {
    if (event.target.matches(".add")) {
        addPokemonToParty(event)
    } else if (event.target.matches(".release")) {
        releasePokemonToWild(event)
    }
})

// EVENT HANDLERS
function addPokemonToParty(event) {
    const trainerId = event.target.dataset.trainerId
    const trainerUl = event.target.nextSibling

    createPokemon(POKEMONS_URL, trainerId)
        .then(newPokemonData => {
            const newPokemonLi = renderPokemonLi(newPokemonData)
            if (newPokemonData.error) {
                alert(newPokemonData.error)
            } else {
                trainerUl.append(newPokemonLi)
            }
        })
}

function releasePokemonToWild(event) {
    const pokeId = event.target.dataset.pokemonId
    const pokemonLi = event.target.closest("li")
    const url = `${POKEMONS_URL}/${pokeId}`

    deletePokemon(url)
        .then(data => {pokemonLi.remove()})
}

// DOM RENDERING

function renderPokemonLi(pokemon) {
    const newLi = document.createElement('li')
    const nickname = pokemon.nickname
    const species = pokemon.species
    const pokeID = pokemon.id
    newLi.textContent = `${nickname} (${species})`
    
    const releaseButton = document.createElement('button')
    releaseButton.classList.add("release")
    releaseButton.dataset.pokemonId = pokeID
    releaseButton.textContent = "Release"
    
    newLi.append(releaseButton)
    return newLi
}

function renderTrainers(trainersData) { 
    trainersData.forEach(renderTrainerCard)
}

function renderTrainerCard(trainer) {
    const trainerCard = document.createElement('div')
    trainerCard.classList.add("card")
    trainerCard.dataset.id = trainer.id
    
    const p = document.createElement('p')
    p.textContent = trainer.name
    
    const button = document.createElement('button')
    button.dataset.trainerId = trainer.id
    button.textContent = "Add Pokemon"
    button.classList.add("add")

    const ul = document.createElement('ul')

    trainer.pokemons.forEach((pokemon) => {
        const li = renderPokemonLi(pokemon)
        ul.append(li)
    })
    trainerCard.append(p, button, ul)
    mainBody.append(trainerCard)
}

getAllTrainers(TRAINERS_URL)
    .then(trainersData => {
        renderTrainers(trainersData)
    })