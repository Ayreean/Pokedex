// JavaScript Function
function pegaPokemons(quantidade) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=" + quantidade)
        .then((response) => response.json())
        .then((allpokemon) => {
            let pokemons = [];

            allpokemon.results.map((val) => {
                fetch(val.url)
                    .then((response) => response.json())
                    .then((pokemonSingle) => {
                        pokemons.push({
                            nome: val.name,
                            imagem: pokemonSingle.sprites.front_default,
                            stats: pokemonSingle.stats,
                            abilities: pokemonSingle.abilities,
                        });

                        let pokemonBoxes =
                            document.querySelector(".pokemon-boxes");
                        pokemonBoxes.innerHTML = "";

                        if (pokemons.length == quantidade) {
                            pokemons.map((val) => {
                                pokemonBoxes.innerHTML += `
                                    <div class="pokemon-box" data-pokemon="${val.nome}">
                                        <img src="${val.imagem}">
                                        <p>${val.nome}</p>
                                    </div>
                                `;
                            });
                        }

                        // Event listener pro click nos pokemons
                        pokemonBoxes.addEventListener("click", (e) => {
                            const selectedPokemon =
                                e.target.closest(".pokemon-box");
                            if (!selectedPokemon) return;

                            const pokemonName = selectedPokemon.dataset.pokemon;
                            const pokemon = pokemons.find(
                                (p) => p.nome === pokemonName
                            );

                            // Fetch detalhes do pokemon
                            fetch(
                                `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
                            )
                                .then((response) => response.json())
                                .then((pokemonInfo) => {
                                    pokemon.types = pokemonInfo.types;
                                    showPokemonDetails(pokemon);
                                });

                            // Mostre o popup
                            let popupOverlay =
                                document.querySelector(".popup-overlay");
                            popupOverlay.style.display = "block";

                            // Event listener pro botão de fechar o popup
                            let popupCloseBtn =
                                document.querySelector(".popup-close-btn");
                            popupCloseBtn.addEventListener("click", () => {
                                popupOverlay.style.display = "none";
                            });
                        });
                    });
            });
        });
}

// Funcao para mostrar os detalhes do pokemon
function showPokemonDetails(pokemon) {
    let pokemonDetails = document.querySelector(".pokemon-details");
    pokemonDetails.innerHTML = `
        <div class="pokemon-detail-box">
            <h2>${pokemon.nome}</h2>
            <img src="${pokemon.imagem}">
            <h3>Type:</h3>
            <ul>
                ${pokemon.types
                    .map((type) => `<li>${type.type.name}</li>`)
                    .join("")}
            </ul>
            <h3>Stats:</h3>
            <ul>
                ${pokemon.stats
                    .map(
                        (stat) =>
                            `<li>${stat.stat.name}: ${stat.base_stat}</li>`
                    )
                    .join("")}
            </ul>
            <h3>Abilities:</h3>
            <ul>
                ${pokemon.abilities
                    .map((ability) => `<li>${ability.ability.name}</li>`)
                    .join("")}
            </ul>
        </div>
    `;
}

// Funcao para pesquisar pokemons pelo nome
function searchByName() {
    const searchInput = document.getElementById("search");
    const searchValue = searchInput.value.trim().toLowerCase();

    const pokemonBoxes = document.querySelectorAll(".pokemon-box");
    pokemonBoxes.forEach((box) => {
        const pokemonName = box.dataset.pokemon.toLowerCase();
        if (pokemonName.includes(searchValue)) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });

    // Se o input estiver vazio, feche o popup
    closePopup();
}

// Funcao para fechar o popup
function closePopup() {
    let popupOverlay = document.querySelector(".popup-overlay");
    popupOverlay.style.display = "none";
}

// Event listener pro input de pesquisa
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", searchByName);

// Chame a funcao para pegar os pokemons
pegaPokemons(807);
