// DOM ELEMENTS
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')

// ✅ When a user loads the page, they should see all trainers, with their current team of Pokemon.
// ✅ Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
// ✅ Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.

// EVENT LISTENERS
main.addEventListener("click", event => {
    if (event.target.matches(".add-button")) {
        addPokemonToParty(event)
    } else if (event.target.matches(".release")) {
        releasePokemonToWild(event)
    }
})

// EVENT HANDLERS
function addPokemonToParty(event) {
    const trainerId = event.target.dataset.trainerId
    const trainerUl = event.target.nextSibling
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ "trainer_id": `${trainerId}`})
    }
    
    fetch(POKEMONS_URL, options)
        .then(resp => resp.json())
        .then(newPokemonData => {
            console.log(newPokemonData)
            //render new pokemon
            const newPokemonLi = renderPokemon(newPokemonData)
            //append to correct Ul if not error
            if (newPokemonData.error === "Party is Full!") {
                alert("Party is Full!")
            } else if (newPokemonData.error === "Trainer not found") {
                alert("Trainer not found")
            } else {
                trainerUl.append(newPokemonLi)
            }
        })
}

function releasePokemonToWild(event) {
    const pokeId = event.target.dataset.pokemonId
    //remove from the DOM
    event.target.closest("li").remove()

    const options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    fetch(`${POKEMONS_URL}/${pokeId}`, options)
        .then(resp => resp.json())
        .then(data => {console.log(data)})    
}

// DOM RENDERING
// returns a new LI that needs to then be appended
function renderPokemon(pokemon) {
    const newLi = document.createElement('li')
    const nickname = pokemon.nickname
    const species = pokemon.species
    const pokeID = pokemon.id
    newLi.textContent = `${nickname} (${species})`
    //release button
    const releaseButton = document.createElement('button')
    releaseButton.classList.add("release")
    releaseButton.dataset.pokemonId = pokeID
    releaseButton.textContent = "Release"
    //append button
    newLi.append(releaseButton)
    return newLi
}

function renderTrainers(trainersData) { 
    trainersData.forEach(renderTrainer)
}

function renderTrainer(trainer) {
    //create a single trainer card !!!
    const trainerCard = document.createElement('div')
    trainerCard.classList.add("card")
    trainerCard.dataset.id = trainer.id
    //make paragraph
    const trainerNameP = document.createElement('p')
    trainerNameP.textContent = trainer.name
    //make button
    const addPokemonButton = document.createElement('button')
    addPokemonButton.dataset.trainerId = trainer.id
    addPokemonButton.textContent = "Add Pokemon"
    addPokemonButton.classList.add("add-button")

    //nested version of adding an event listener
    // addPokemonButton.addEventListener("click", addPokemonToParty)

    //pokemon UL
    const pokemonPartyUl = document.createElement('ul')
    //create LIs for inside of each UL
    trainer.pokemons.forEach((pokemon) => {
        const renderedPokemonLi = renderPokemon(pokemon)
        pokemonPartyUl.append(renderedPokemonLi)
    })
    //append all to trainer card
    trainerCard.append(trainerNameP, addPokemonButton, pokemonPartyUl)
    //append to <main>
    main.append(trainerCard)
}

function initialize() {
    fetch(TRAINERS_URL)
        .then(rspec => rspec.json())
        .then(trainersData => {
            renderTrainers(trainersData)
        })
}

initialize()