//   ***    BUSCADOR  ***  \\

let offsetSearch = 0;

// ***  BUSCAR GIF  ***  \\
const getSearch = async (search) => {
	event.preventDefault();
	cleanSearchSuggestions();
	$searchInputHero.value = search;
	$navbarSearchInput.value = search;
	$searchTitle.innerHTML = search;

	// ***  LIMPIA LA GALERIA DE GIF  ***  \\
	if (offsetSearch === 0) {
		$searchResultGallery.innerHTML = '';
	}

	//  ***   FETCH  CON 12 GIFS  PEDIDOS **   \\
	await fetch(
		`${searchEndpoint}?api_key=${apiKey}&q=${search}&offset=${offsetSearch}&limit=12&rating=g`
	)
		.then((response) => response.json())   // ***  TRAE EL JSON  ***  \\
		.then((results) => {
			if (results.data == 0) {
				displayErrorSearch();
			} else {
				displaySearchGif(results);
			}
		})
		.catch((err) => console.log(err));
};

// ***   TRAE LOS GIF  *** \\
const displaySearchGif = (results) => {
	$searchResultContainer.classList.remove('hidden');
	$verMasbtn.classList.remove('hidden');

	if (offsetSearch === 0) {
		window.scrollTo({ top: 600, behavior: 'smooth' });
	}

	if (results.data.length < 12) {
		$verMasbtn.style.display = 'none';
	}

	for (let i = 0; i < results.data.length; i++) {
		let showGif = results.data[i];
		let showGifImages = showGif.images.original.url;
		let showGifUsername = showGif.username;
		let showGifTitle = showGif.title;

		const gifContainer = document.createElement('div');
		gifContainer.classList.add('gif_container');
		gifContainer.innerHTML = ` 
		<img class="gif" onclick="maximizeGif('${showGifImages}','${showGifUsername}','${showGifTitle}')" src="${showGifImages}" alt="${showGifTitle}">
	
		<div class="gifActions">
			<div class="gifActions_btn">
				<div class="btn favorite" onclick="addToFav('${showGifImages}','${showGifUsername}','${showGifTitle}')"></div>
				<div class="btn download" onclick="downloadGif('${showGifImages}','${showGifTitle}')"></div>
				<div class="btn maximize" onclick="maximizeGif('${showGifImages}','${showGifUsername}','${showGifTitle}')"></div>
			</div>
			<div class="gif_info">
				<p class="gif_user">${showGifUsername}</p>
				<p class="gif_title">${showGifTitle}</p>
			</div>
		</div>
		`;
		$searchResultGallery.appendChild(gifContainer);
	}
};

// ***   ERROR EN BUSCAR GIF  ***  \\
const displayErrorSearch = () => {
	$searchResultContainer.classList.remove('hidden');
	$errorContainer.classList.remove('hidden');
	$errorContainer.innerHTML = `
	<div class="error_container" id="error-container">
	<img class="" id="error-search" src="assets/icon-busqueda-sin-resultado.svg" alt="Busqueda sin resultado" >
	<h4 class="error-search-text">Intenta con otra búsqueda.</h4>
	</div>
	`;
	$verMasbtn.style.display = 'none';
};

// ***  FUNCION  BOTON VER MAS  *** \\
const verMasButton = () => {
	offsetSearch += 12;
	if ($searchInputHero.value) {
		getSearch($searchInputHero.value);
	} else {
		getSearch($navbarSearchInput.value);
	}
};

// ***  SUGERENCIAS  **  \\


const getSearchSuggestions = async () => {
	cleanSearchSuggestions();
	$searchSuggestionList.classList.remove('hidden');
	const USER_INPUT = $searchInputHero.value;

	if (USER_INPUT.length >= 1) {
		await fetch(
			`${searchAutocomplete}?api_key=${apiKey}&q=${USER_INPUT}&limit=4&rating=g`
		)
			.then((response) => response.json())
			.then((suggestions) => {
				displaySuggestions(suggestions);
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

const displaySuggestions = (suggestions) => {
	for (let i = 0; i < suggestions.data.length; i++) {
		let searchGif = suggestions.data[i].name;
		const searchSuggestionItem = document.createElement('li');
		searchSuggestionItem.classList.add('SearchSuggestions_item');

		searchSuggestionItem.innerHTML = `
		<img class="search_btnGray" id="" src="assets/icon-search-gray.svg" alt="Boton Buscar" onclick="getSearch('${searchGif}')">
		<p class="search_Text" onclick="getSearch('${searchGif}')">${searchGif}</p>`;
		$searchSuggestionList.appendChild(searchSuggestionItem);
	}
};

// ***CONTENEDOR CON SETEO AL INICIO *** \\
const cleanResultsContainer = () => {
	$searchResultContainer.classList.add('hidden');
	$errorContainer.classList.add('hidden');
	$verMasbtn.style.display = 'block';
	$searchResultGallery.innerHTML = '';
	$navbarSearchInput.placeholder = 'Busca GIFOS y más';
	$searchInputHero.placeholder = 'Busca GIFOS y más';
};

// ***  LIMPIA DE SUGERENCIAS *** \\
const cleanSearchSuggestions = () => {
	$searchSuggestionList.classList.add('hidden');
	$searchSuggestionList.innerHTML = '';
};

// ***  BUSCADOR ACTIVO  ***  \\
const setActiveSearchBar = () => {
	$searchGrayBtn.classList.remove('hidden');
	$searchCloseBtn.classList.remove('hidden');
	$searchBtn.classList.add('hidden');
	$searchSuggestionsContainer.classList.remove('hidden');
	$searchContainer.classList.add('searchActive');
	$searchSuggestionsContainer.classList.add('searchActiveContainer');
};

const setActiveNavbarSearch = () => {
	$navbarSearchGrayBtn.classList.remove('hidden');
	$navbarSearchCloseBtn.classList.remove('hidden');
	$navbarSearchBtn.classList.add('hidden');
};

// ***  BUSCADOR  INACTIVO  ***  \\
// ***  RESETEO DE CONTENEDOR, CAMBIO DE CRUZ POR LUPA  *** \\
const setInactiveSearchBar = () => {
	$navbarSearchInput.value = '';
	$searchInputHero.value = '';
	cleanResultsContainer();
	cleanSearchSuggestions();
	$searchSuggestionsContainer.classList.add('hidden');
	$searchBtn.classList.remove('hidden');
	$searchCloseBtn.classList.add('hidden');
	$searchGrayBtn.classList.add('hidden');
	$searchContainer.classList.remove('searchActive');
};

const setInactiveNavbarSearch = () => {
	$navbarSearchInput.value = '';
	$searchInputHero.value = '';
	cleanResultsContainer();
	$navbarSearchBtn.classList.remove('hidden');
	$navbarSearchCloseBtn.classList.add('hidden');
	$navbarSearchGrayBtn.classList.add('hidden');
};

// *** EVENTOS  ***  \\

// *** EN BUSCADOR PRINCIPAL  ***  \\
$searchGrayBtn.addEventListener('click', () => {
	getSearch($searchInputHero.value);
});
$searchInputHero.addEventListener('keypress', (event) => {
	if (event.keyCode === 13) {
		getSearch($searchInputHero.value);
	}
});
$searchInputHero.addEventListener('click', setActiveSearchBar);
$searchInputHero.addEventListener('input', setActiveSearchBar);
$searchInputHero.addEventListener('input', getSearchSuggestions);
$searchInputHero.addEventListener('input', cleanResultsContainer);

$searchCloseBtn.addEventListener('click', setInactiveSearchBar);
$verMasbtn.addEventListener('click', verMasButton);

// ***  EN BUSCADOR NAVBAR  ***  \\
$navbarSearchGrayBtn.addEventListener('click', () => {
	getSearch($navbarSearchInput.value);
});
$navbarSearchInput.addEventListener('keypress', (event) => {
	if (event.keyCode === 13) {
		getSearch($navbarSearchInput.value);
	}
});
$navbarSearchInput.addEventListener('click', setActiveNavbarSearch);
$navbarSearchInput.addEventListener('input', setActiveNavbarSearch);
$navbarSearchCloseBtn.addEventListener('click', setInactiveNavbarSearch);
$navbarSearchInput.addEventListener('input', cleanResultsContainer);

