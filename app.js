const publicKey = '7a6efc35849d7147226b23231e122ee6';
const privateKey = '2840c0c7cb130f914f13b3e93e83f7b0aebeccc4';
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';

const fetchSuggestions = async () => {
    const query = document.getElementById('searchInput').value;
    const ts = Date.now();
    const hash = CryptoJS.MD5(`${ts}${privateKey}${publicKey}`).toString();
    const url = `${baseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
        const response = await fetch(url);
        const { data } = await response.json();
        
        const select = document.getElementById('suggestions');
        select.innerHTML = '<option value="">Quizas quisiste decir</option>';

        if (data.results.length > 0) {
            data.results.forEach(({ id, name }) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
    }
};

const searchCharacter = async () => {
    const characterName = document.getElementById('searchInput').value;
    const characterId = document.getElementById('suggestions').value;
    const ts = Date.now();
    const hash = CryptoJS.MD5(`${ts}${privateKey}${publicKey}`).toString();
    let url = '';

    if (characterId) {
        url = `${baseUrl}/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    } else if (characterName) {
        url = `${baseUrl}?name=${characterName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    } else {
        alert('Por favor ingresa un nombre o selecciona un personaje para la busqueda.');
        return;
    }

    try {
        const response = await fetch(url);
        const { data } = await response.json();

        if (data.results.length > 0) {
            const [character] = data.results;

            const comics = character.comics.items.map(({ name }) => name).slice(0, 5).join(", ");
            const series = character.series.items.map(({ name }) => name).slice(0, 5).join(", ");
            const events = character.events.items.map(({ name }) => name).slice(0, 5).join(", ");
            const stories = character.stories.items.map(({ name }) => name).slice(0, 5).join(", ");

            const characterInfo = `
                <div class="character-profile">
                    <div class="character-image">
                        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                    </div>
                    <div class="character-details">
                        <h2>${character.name}</h2>
                        <p>${character.description || "No hay descripción disponible."}</p>
                    </div>
                </div>
                <table>
                    <tr>
                        <th colspan="2">Datos Adicionales</th>
                    </tr>
                    <tr>
                        <td><strong>Cómics</strong></td>
                        <td>${comics || "No hay cómics disponibles."}</td>
                    </tr>
                    <tr>
                        <td><strong>Series</strong></td>
                        <td>${series || "No hay series disponibles."}</td>
                    </tr>
                    <tr>
                        <td><strong>Eventos</strong></td>
                        <td>${events || "No hay eventos disponibles."}</td>
                    </tr>
                    <tr>
                        <td><strong>Historias</strong></td>
                        <td>${stories || "No hay historias disponibles."}</td>
                    </tr>
                </table>
            `;
            document.getElementById('results').innerHTML = characterInfo;
            document.getElementById('modal').style.display = 'block';
        } else {
            document.getElementById('results').innerHTML = 'Personaje no encontrado.';
            document.getElementById('modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        document.getElementById('results').innerHTML = 'Error en la búsqueda.';
        document.getElementById('modal').style.display = 'block';
    }
};

const selectCharacter = () => {
    const characterId = document.getElementById('suggestions').value;
    if (characterId) {
        searchCharacter();
    }
};

const closeModal = () => {
    document.getElementById('modal').style.display = 'none';
};

document.getElementById('searchInput').addEventListener('input', fetchSuggestions);
document.getElementById('searchButton').addEventListener('click', searchCharacter);
document.getElementById('suggestions').addEventListener('change', selectCharacter);
document.getElementById('closeModal').addEventListener('click', closeModal);
