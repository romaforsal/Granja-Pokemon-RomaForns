// Cargar los Pokémon desde localStorage al cargar la página
let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || [];

// Función para obtener la imagen del Pokémon desde la PokeAPI
async function obtenerImagenPokemon(nombre) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    const data = await response.json();
    return data.sprites.front_default; // URL de la imagen
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    return 'https://via.placeholder.com/100'; // Imagen por defecto si no se puede obtener
  }
}

// Función para mostrar la lista de Pokémon
function mostrarPokemon() {
  const lista = document.getElementById('pokemonList');
  lista.innerHTML = '';  // Limpiar la lista

  pokemonList.forEach(async (pokemon, index) => {
    // Obtener la imagen desde la PokeAPI
    const imagen = await obtenerImagenPokemon(pokemon.nombre);

    const item = document.createElement('li');
    item.innerHTML = `
        <strong>${pokemon.nombre}</strong><br>
        <img src="${imagen}" alt="${pokemon.nombre}" width="100"><br>
        Tipo: ${pokemon.tipo}<br>
        Nivel: ${pokemon.nivel}<br>
        Habilidad: ${pokemon.habilidad}<br>
        Fecha de llegada: ${pokemon.fechaLlegada}<br>
        <button class="eliminarBtn" data-index="${index}">Eliminar</button>
        `;

    // Evento para eliminar Pokémon
    item.querySelector('.eliminarBtn').addEventListener('click', () => {
        pokemonList.splice(index, 1);
        guardarPokemon();
        mostrarPokemon();
    });

    lista.appendChild(item);
  });
}

// Guardar la lista de Pokémon en localStorage
function guardarPokemon() {
  localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
}

// Filtrar la lista de Pokémon por tipo y habilidad
function filtrarPokemon() {
  const tipoFiltro = document.getElementById('filtroTipo').value.toLowerCase();
  const habilidadFiltro = document.getElementById('filtroHabilidad').value.toLowerCase();

  const pokemonFiltrado = pokemonList.filter(pokemon => {
    return (
      (pokemon.tipo.toLowerCase().includes(tipoFiltro) || tipoFiltro === '') &&
      (pokemon.habilidad.toLowerCase().includes(habilidadFiltro) || habilidadFiltro === '')
    );
  });

  // Mostrar los Pokémon filtrados
  const lista = document.getElementById('pokemonList');
  lista.innerHTML = '';
  pokemonFiltrado.forEach(pokemon => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${pokemon.nombre}</strong><br>
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}" width="100"><br>
      Tipo: ${pokemon.tipo}<br>
      Nivel: ${pokemon.nivel}<br>
      Habilidad: ${pokemon.habilidad}<br>
      Fecha de llegada: ${pokemon.fechaLlegada}
    `;
    lista.appendChild(item);
  });
}

// Función para manejar el formulario de registro de Pokémon
document.getElementById('pokemonForm').addEventListener('submit', async (event) => {
  event.preventDefault();  // Evitar que se recargue la página

  const nombre = document.getElementById('nombre').value;
  const tipo = document.getElementById('tipo').value;
  const nivel = document.getElementById('nivel').value;
  const habilidad = document.getElementById('habilidad').value;
  const fecha = document.getElementById('fecha').value;

  // Obtener la imagen del Pokémon usando la PokeAPI
  const imagen = await obtenerImagenPokemon(nombre);

  const nuevoPokemon = {
    nombre,
    tipo,
    nivel,
    habilidad,
    fechaLlegada: fecha,
    imagen: imagen, // Añadir la imagen al nuevo Pokémon
  };

  pokemonList.push(nuevoPokemon);
  guardarPokemon();
  mostrarPokemon();

  // Limpiar el formulario
  document.getElementById('pokemonForm').reset();
});

// Configurar el evento de filtrado
document.getElementById('filtrarBtn').addEventListener('click', filtrarPokemon);

// Mostrar los Pokémon al cargar la página
mostrarPokemon();
