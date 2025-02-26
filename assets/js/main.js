document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById('card-container');
    const pokemonInput = document.getElementById('pokemon-id-input');
    const searchButton = document.getElementById('search-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const corsNote = document.getElementById('cors-note');
    
    let currentPokemonId = 1;
    
    // Predefined data for demo purposes in case API fails
    const demoData = {
        1: {
            id: 1,
            name: "bulbasaur",
            height: 7,
            weight: 69,
            types: [
                { type: { name: "grass" } },
                { type: { name: "poison" } }
            ],
            stats: [
                { base_stat: 45, stat: { name: "hp" } },
                { base_stat: 49, stat: { name: "attack" } },
                { base_stat: 49, stat: { name: "defense" } },
                { base_stat: 65, stat: { name: "special-attack" } },
                { base_stat: 65, stat: { name: "special-defense" } },
                { base_stat: 45, stat: { name: "speed" } }
            ],
            sprites: {
                front_default: "/api/placeholder/180/180",
                other: {
                    "official-artwork": {
                        front_default: "/api/placeholder/180/180"
                    }
                }
            }
        },
        4: {
            id: 4,
            name: "charmander",
            height: 6,
            weight: 85,
            types: [
                { type: { name: "fire" } }
            ],
            stats: [
                { base_stat: 39, stat: { name: "hp" } },
                { base_stat: 52, stat: { name: "attack" } },
                { base_stat: 43, stat: { name: "defense" } },
                { base_stat: 60, stat: { name: "special-attack" } },
                { base_stat: 50, stat: { name: "special-defense" } },
                { base_stat: 65, stat: { name: "speed" } }
            ],
            sprites: {
                front_default: "/api/placeholder/180/180",
                other: {
                    "official-artwork": {
                        front_default: "/api/placeholder/180/180"
                    }
                }
            }
        },
        7: {
            id: 7,
            name: "squirtle",
            height: 5,
            weight: 90,
            types: [
                { type: { name: "water" } }
            ],
            stats: [
                { base_stat: 44, stat: { name: "hp" } },
                { base_stat: 48, stat: { name: "attack" } },
                { base_stat: 65, stat: { name: "defense" } },
                { base_stat: 50, stat: { name: "special-attack" } },
                { base_stat: 64, stat: { name: "special-defense" } },
                { base_stat: 43, stat: { name: "speed" } }
            ],
            sprites: {
                front_default: "/api/placeholder/180/180",
                other: {
                    "official-artwork": {
                        front_default: "/api/placeholder/180/180"
                    }
                }
            }
        },
        25: {
            id: 25,
            name: "pikachu",
            height: 4,
            weight: 60,
            types: [
                { type: { name: "electric" } }
            ],
            stats: [
                { base_stat: 35, stat: { name: "hp" } },
                { base_stat: 55, stat: { name: "attack" } },
                { base_stat: 40, stat: { name: "defense" } },
                { base_stat: 50, stat: { name: "special-attack" } },
                { base_stat: 50, stat: { name: "special-defense" } },
                { base_stat: 90, stat: { name: "speed" } }
            ],
            sprites: {
                front_default: "/api/placeholder/180/180",
                other: {
                    "official-artwork": {
                        front_default: "/api/placeholder/180/180"
                    }
                }
            }
        }
    };
    
    // Initial load
    fetchPokemon(currentPokemonId);
    
    // Event listeners
    searchButton.addEventListener('click', () => {
        const id = parseInt(pokemonInput.value);
        if (id >= 1 && id <= 898) {
            currentPokemonId = id;
            fetchPokemon(currentPokemonId);
            updateNavigationButtons();
        } else {
            alert('Please enter a valid Pokémon ID (1-898)');
        }
    });
    
    prevButton.addEventListener('click', () => {
        if (currentPokemonId > 1) {
            currentPokemonId--;
            pokemonInput.value = currentPokemonId;
            fetchPokemon(currentPokemonId);
            updateNavigationButtons();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentPokemonId < 898) {
            currentPokemonId++;
            pokemonInput.value = currentPokemonId;
            fetchPokemon(currentPokemonId);
            updateNavigationButtons();
        }
    });
    
    function updateNavigationButtons() {
        prevButton.disabled = currentPokemonId <= 1;
        nextButton.disabled = currentPokemonId >= 898;
    }

    function fetchPokemon(id) {
cardContainer.innerHTML = '<div class="loading">Loading Pokémon data...</div>';

// FIXED: Use correct endpoint for individual Pokémon
fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        corsNote.style.display = 'none';
        return response.json();
    })
    .then(data => {
        renderPokemonCard(data);
    })
    .catch(error => {
        console.error("API Error:", error);
        
        // Fallback to demo data
        if (demoData[id]) {
            corsNote.style.display = 'block';
            renderPokemonCard(demoData[id]);
        } else if (demoData[1]) {
            corsNote.style.display = 'block';
            renderPokemonCard(demoData[1]);
            
            cardContainer.innerHTML += `
                <div class="error-message">
                    <strong>Error:</strong> Could not fetch Pokémon #${id}.<br>
                    API request failed: ${error.message}<br>
                    Showing default Pokémon data instead.
                </div>
            `;
        } else {
            cardContainer.innerHTML = `
                <div class="error-message">
                    <strong>Error:</strong> Failed to fetch Pokémon data.<br>
                    API request failed: ${error.message}<br>
                    <p>This may be due to CORS restrictions. Try using a CORS browser extension or running on a local server.</p>
                </div>
            `;
        }
    });
}

  
    function renderPokemonCard(pokemon) {
        // Get the sprite - official artwork if available, otherwise use placeholder
        const sprite = (pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other['official-artwork'] && 
                       pokemon.sprites.other['official-artwork'].front_default) || 
                       (pokemon.sprites && pokemon.sprites.front_default) || 
                       "/api/placeholder/180/180";
        
        // Get stats
        const stats = {};
        pokemon.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });
        
        // Create the card HTML
        const cardHTML = `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="pokemon-number">#${pokemon.id.toString().padStart(3, '0')}</div>
                        <div class="pokemon-name">${pokemon.name}</div>
                        <div class="pokemon-image">
                            <img src="${sprite}" alt="${pokemon.name}">
                        </div>
                        <div class="pokemon-types">
                            ${pokemon.types.map(type => 
                                `<div class="type type-${type.type.name}">${type.type.name}</div>`
                            ).join('')}
                        </div>
                        <p style="margin-top: 20px; font-size: 14px;">(Click to see details)</p>
                    </div>
                    <div class="card-back">
                        <div class="pokemon-number">#${pokemon.id.toString().padStart(3, '0')}</div>
                        <div class="pokemon-name">${pokemon.name}</div>
                        
                        <div class="pokemon-stats">
                            <div class="stat-row">
                                <div class="stat-name">HP</div>
                                <div class="stat-value">${stats['hp']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['hp'] / 255 * 100}%;"></div>
                            </div>
                            
                            <div class="stat-row">
                                <div class="stat-name">Attack</div>
                                <div class="stat-value">${stats['attack']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['attack'] / 255 * 100}%;"></div>
                            </div>
                            
                            <div class="stat-row">
                                <div class="stat-name">Defense</div>
                                <div class="stat-value">${stats['defense']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['defense'] / 255 * 100}%;"></div>
                            </div>
                            
                            <div class="stat-row">
                                <div class="stat-name">Sp. Attack</div>
                                <div class="stat-value">${stats['special-attack']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['special-attack'] / 255 * 100}%;"></div>
                            </div>
                            
                            <div class="stat-row">
                                <div class="stat-name">Sp. Defense</div>
                                <div class="stat-value">${stats['special-defense']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['special-defense'] / 255 * 100}%;"></div>
                            </div>
                            
                            <div class="stat-row">
                                <div class="stat-name">Speed</div>
                                <div class="stat-value">${stats['speed']}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stats['speed'] / 255 * 100}%;"></div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <div><strong>Height:</strong> ${pokemon.height / 10} m</div>
                            <div><strong>Weight:</strong> ${pokemon.weight / 10} kg</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        cardContainer.innerHTML = cardHTML;
        
        // Add click event to flip the card
        const card = document.querySelector('.card');
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    }
});
