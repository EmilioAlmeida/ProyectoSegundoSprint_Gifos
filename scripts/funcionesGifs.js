//***   FUNCIONES DE LOS GIF   ***  \\

// *** FAVORITOS  *** \\
let arrFavoriteGifs = [];


const addToFav = (gif, username, title) => {
	let objGif = {
		gif: gif,
		username: username,
		title: title,
	};

	let buscarIndice = arrFavoriteGifs.findIndex(gif => gif.gif === objGif.gif);
	if (buscarIndice < 0) {
		arrFavoriteGifs.push(objGif);
	};

	localStorage.setItem('FavoriteGifs', JSON.stringify(arrFavoriteGifs));


	displayFavoriteGifs();


};

const displayFavoriteSection = (event) => {
	event.preventDefault();
	$heroSection.classList.add('hidden');
	$misGifosSection.classList.add('hidden');
	$createGifSection.classList.add('hidden');
	$favSection.classList.remove('hidden');
	window.scrollTo({ top: 0, behavior: 'smooth' });
	displayFavoriteGifs();

	if (arrFavoriteGifs == 0 || arrFavoriteGifs == null) {
		$noFavsContainer.classList.remove('hidden');
		$favContainer.classList.add('hidden');
	} else {
		$noFavsContainer.classList.add('hidden');
		$favContainer.classList.remove('hidden');
	}
};

const displayFavoriteGifs = () => {
	$favContainer.innerHTML = '';

	arrFavoriteGifs = JSON.parse(localStorage.getItem('FavoriteGifs'));

	if (arrFavoriteGifs == null) {
		arrFavoriteGifs = [];
	} else {
		for (let i = 0; i < arrFavoriteGifs.length; i++) {
			let favGif = arrFavoriteGifs[i];
			let gifyFav = favGif.gif;
			let usernameFav = favGif.username;
			let titleFav = favGif.title;

			const gifContainer = document.createElement('div');
			gifContainer.classList.add('gif_container');
			gifContainer.innerHTML = ` 
			<img class="gif" onclick="maximizeFavoriteGif('${gifyFav}','${usernameFav}','${titleFav}')" src="${gifyFav}" alt="${titleFav}">
			
			<div class="gifActions">
				<div class="gifActions_btn">
				<div class="btn remove" onclick="removeGif('${gifyFav}')"></div>
				<div class="btn download" onclick="downloadGif('${gifyFav}','${titleFav}')"></div>
				<div class="btn maximize" onclick="maximizeFavoriteGif('${gifyFav}','${usernameFav}','${titleFav}')"></div>
				</div>
				<div class="gif_info">
				<p class="gif_user">${usernameFav} </p>
				<p class="gif_title">${titleFav}</p>
				</div>
			</div>
			`;
			$favContainer.appendChild(gifContainer);
		}
	}
};

$favoritosMenu.addEventListener('click', displayFavoriteSection);

//***  MIS GIFOS  ***//

const displayMisGifosSection = (event) => {
	event.preventDefault();
	$misGifosSection.classList.remove('hidden');
	$heroSection.classList.add('hidden');
	$favSection.classList.add('hidden');
	$createGifSection.classList.add('hidden');
	$trendingSection.classList.remove('hidden');
	window.scrollTo({ top: 0, behavior: 'smooth' });
	displayMiGifos();

	if (arrMyGifos == 0 || arrMyGifos == null) {
		$noGifContainer.classList.remove('hidden');
		$misGifosContainer.classList.add('hidden');
	} else {
		$noGifContainer.classList.add('hidden');
		$misGifosContainer.classList.remove('hidden');
	}
};
$misGifosMenu.addEventListener('click', displayMisGifosSection);

const displayMiGifos = () => {
	$misGifosContainer.innerHTML = '';

	arrMyGifos = JSON.parse(localStorage.getItem('MyGifs'));


	console.log(arrMyGifos);
	if (arrMyGifos == null) {
		arrMyGifos = [];
	} else {
		for (let i = 0; i < arrMyGifos.length; i++) {
			fetch(
				`${getGifByIdEndpoint}?ids=${arrMyGifos[i]}&api_key=${apiKey}`
			)
				.then((response) => response.json())
				.then((misGifosGiphy) => {
					let giphyGif = misGifosGiphy.data[0];
					let imagesGiphy = giphyGif.images.original.url;
					let idGiphy = giphyGif.id;

					console.log(misGifosGiphy);
					console.log(typeof idGiphy);

					const gifContainer = document.createElement('div');
					gifContainer.classList.add('gif_container');
					gifContainer.innerHTML = `
					<img class="gif" src="${imagesGiphy}" alt="Gif Creado por el usuario">
					
					<div class="gifActions">
						<div class="gifActions_btn">
						<div class="btn remove" onclick="removeMyGifos('${idGiphy}')"></div>
						<div class="btn download" onclick="downloadGif('${imagesGiphy}','Gif')"></div>
						<div class="btn maximize" onclick="maximizeFavoriteGif('${imagesGiphy}','User','Gif')"></div>
						</div>
						<div class="gif_info">
							<p class="gif_user">Emilio Oscar Almeida</p>
							<p class="gif_title">Web Developer</p>
						</div>
					</div>
					`;
					$misGifosContainer.appendChild(gifContainer);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}
};

// ***  DESCARGA   ***  \\

const downloadGif = async (url, title) => {
	let blob = await fetch(url).then((img) => img.blob());
	invokeSaveAsDialog(blob, title + '.gif');
};

// ***  AMPLIAR   *** \\

const maximizeGif = (gif, username, title) => {
	$maximizedGifSection.classList.remove('hidden');
	$maximizedGifSection.classList.add('maximizedGif');
	$maximizedGifSection.innerHTML = '';
	const maximizedGifContainer = document.createElement('div');
	maximizedGifContainer.classList.add('maximizedGif_container');
	maximizedGifContainer.innerHTML = `
	<div class="close-btn" id="close-max-btn" onclick="closeMaximized()"></div>
	<div class="maxGif_Container">
		<img class="gifMax" src="${gif}" alt="${title}">
	</div>
	<div class="gifMaxActions">
		<div class="gif_info">
			<p class="gif_user">${username}</p>
			<p class="gif_title">${title}</p>
		</div>
		<div class="gifMaxActions_btn">
			<div class="buttonsMax favoriteMax" onclick="addToFav('${gif}', '${username}', '${title}')"></div>
			<div class="buttonsMax downloadMax" onclick="downloadGif('${gif}','${title}')"></div>
			</div>
	</div>`;
	$maximizedGifSection.appendChild(maximizedGifContainer);
};

const maximizeFavoriteGif = (gif, username, title) => {
	$maximizedGifSection.classList.remove('hidden');
	$maximizedGifSection.classList.add('maximizedGif');
	$maximizedGifSection.innerHTML = '';
	const maximizedGifContainer = document.createElement('div');
	maximizedGifContainer.classList.add('maximizedGif_container');
	maximizedGifContainer.innerHTML = `
	<div class="close-btn" id="close-max-btn" onclick="closeMaximized()"></div>
	<div class="maxGif_Container">
		<img class="gifMax" src="${gif}" alt="${title}">
	</div>
	<div class="gifMaxActions">
		<div class="gif_info">
			<p class="gif_user">${username}</p>
			<p class="gif_title">${title}</p>
		</div>
		<div class="gifMaxActions_btn">
			<div class="buttonsMax removeMax" onclick="removeGif('${gif}')"></div>
			<div class="buttonsMax downloadMax" onclick="downloadGif('${gif}','${title}')"></div>
			</div>
	</div>`;
	$maximizedGifSection.appendChild(maximizedGifContainer);
};

const closeMaximized = () => {
	$maximizedGifSection.classList.add('hidden');
	$maximizedGifSection.classList.remove('maximizedGif');
};

// ***   BORRADO DE FAVORITOS  *** \\

const removeGif = (gif) => {
	let arrFavoriteParsed = JSON.parse(localStorage.getItem('FavoriteGifs'));
	//console.log(arrFavoriteParsed);
	for (let i = 0; i < arrFavoriteParsed.length; i++) {
		if (arrFavoriteParsed[i].gif === gif) {
			arrFavoriteParsed.splice(i, 1);
			localStorage.setItem('FavoriteGifs', JSON.stringify(arrFavoriteParsed));
			displayFavoriteSection(event);
			closeMaximized();
		}
	}
};

// ***   BORRADO DE MIS GIFOS  *** \\

const removeMyGifos = (gif) => {
	event.preventDefault();
	let arrMyGifosParsed = JSON.parse(localStorage.getItem('MyGifs'));
	//console.log(arrMyGifosParsed);
	for (let i = 0; i < arrMyGifosParsed.length; i++) {
		if (arrMyGifosParsed[i] == gif) {
			arrMyGifosParsed.splice(i, 1);
			localStorage.setItem('MyGifs', JSON.stringify(arrMyGifosParsed));
			displayMisGifosSection(event);
			closeMaximized();
		}
	}
};

