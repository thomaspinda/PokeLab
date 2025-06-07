  const starterNames = {
      kanto: ['bulbasaur', 'charmander', 'squirtle'],
      johto: ['chikorita', 'cyndaquil', 'totodile'],
      hoenn: ['treecko', 'torchic', 'mudkip']
    };

    const typeColors = {
      grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820',
      normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
      fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
      ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
      steel: '#B8B8D0', flying: '#A890F0'
    };

    let selectedStarter = null;
    let pickedStarters = new Set();

    document.getElementById("region").addEventListener("change", showStarters);
    document.getElementById("registerBtn").addEventListener("click", registerTrainer);
    document.getElementById("resetBtn").addEventListener("click", resetApp);

    async function showStarters() {
      const region = document.getElementById("region").value;
      const startersContainer = document.getElementById("starters");
      selectedStarter = null;
      startersContainer.innerHTML = "";

      if (!region) return;

      for (const name of starterNames[region]) {
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json());

        const pokemonID = data.id.toString().padStart(3, '0');
        const sprite = data.sprites.front_default;
        const types = data.types.map(t => t.type.name);
        const typeMain = types[0];
        const bgColor = typeColors[typeMain] || '#AAA';

        const card = document.createElement("div");
        card.className = "card";
        card.style.backgroundColor = bgColor;
        card.innerHTML = `
          <div class="pokedex-id">#${pokemonID}</div>
          <img src="${sprite}" alt="${name}" />
          <h3>${capitalize(name)}</h3>
          <div class="types">
            ${types.map(type => `<span class="type">${capitalize(type)}</span>`).join('')}
          </div>
        `;

        if (pickedStarters.has(name)) {
          card.classList.add("unavailable");
        } else {
          card.addEventListener("click", () => {
            if (card.classList.contains("unavailable")) return;

            document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedStarter = name;
          });
        }

        startersContainer.appendChild(card);
      }
    }

    function registerTrainer() {
      const name = document.getElementById("name").value.trim();
      const region = document.getElementById("region").value;

      if (!name) {
        alert("Por favor, ingresa un nombre.");
        return;
      }

      if (!region || !selectedStarter) {
        alert("Debes seleccionar una región y un Pokémon inicial disponible.");
        return;
      }

      pickedStarters.add(selectedStarter);

      const list = document.getElementById("trainerList");
      const li = document.createElement("li");
      li.innerText = `${name} de ${capitalize(region)} eligió a ${capitalize(selectedStarter)}`;
      list.appendChild(li);

      document.getElementById("name").value = "";
      selectedStarter = null;
      showStarters();
    }

    function resetApp() {
      pickedStarters.clear();
      document.getElementById("trainerList").innerHTML = "";
      document.getElementById("name").value = "";
      document.getElementById("region").value = "";
      document.getElementById("starters").innerHTML = "";
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }