const player = document.getElementById('player');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');
const song = document.getElementById('song');
const playlistContainer = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults'); 
const searchButton = document.getElementById('searchButton');
const music = [
  { 
    file: 'music/Sin_-_Hard_Ebm.mp3', 
    artist: 'Sin', 
    title: 'Hard Ebm', 
    coverSrc: '/img/Sin.png' 
  },
  { 
    file: 'music/Dark_Techno_EBM_-_Industrial_Type_Beat.mp3', 
    artist: 'Dark Techno EBM', 
    title: 'Industrial Type Beat', 
    coverSrc: '/img/No_cover.png' 
  },
  { 
    file: 'music/Drum_and_Bass_-_Atmospheric_Drum_and_Bass.mp3', 
    artist: 'Drum and Bass', 
    title: 'Atmospheric Drum and Bass', 
    coverSrc: '/img/Atmospheric_Drum_and_Bass.png' 
  },
  { 
    file: 'music/Drum_and_Bass_-_Deep_Drum_and_Bass.mp3', 
    artist: 'Drum and Bass', 
    title: 'Deep Drum and Bass', 
    coverSrc: '/img/Atmospheric_Drum_and_Bass.png' 
  },
  { 
    file: 'music/Drum_and_Bass_-_Jump_up_Drum_and_Bass.mp3', 
    artist: 'Drum and Bass', 
    title: 'Jump up Drum and Bass', 
    coverSrc: '/img/Jump_up_Drum_and_Bass.png' 
  },
  { 
    file: 'music/TWAN_-_Black_Widow_Industrial_Techno.mp3', 
    artist: 'TWAN', 
    title: 'Black Widow Industrial Techno', 
    coverSrc: '/img/No_cover.png' 
  },
  { 
    file: 'music/lfilipe_Techno_Art_-_Whispers_in_the_Dark.mp3', 
    artist: 'lfilipe Techno Art', 
    title: 'Whispers in the Dark', 
    coverSrc: '/img/lfilipe_Techno.png' 
  },
  { 
    file: 'music/Nyctonian_-_Influenceur_Nyctonian_Industrial_Techno_Remix.mp3', 
    artist: 'Nyctonian', 
    title: 'Influenceur Nyctonian Industrial Techno Remix', 
    coverSrc: '/img/No_cover.png'
  },
];


function updateCurrentSong(track) { // Функция для обновления информации о текущем треке
  player.src = track.file;
  cover.src = track.coverSrc;
  artist.textContent = track.artist;
  song.textContent = track.title;
}

function addTrackToPlaylist(track) { // Обработчик клика для треков в плейлисте
  const li = document.createElement('li');
  li.classList.add('playlist-item');
  li.textContent = "• " + `${track.title} - ${track.artist}`;
  playlistContainer.appendChild(li); // Добавляем элемент списка в плейлист

  const hr = document.createElement('div');
  hr.classList.add('hr-playlist');
  playlistContainer.appendChild(hr);

  const playlistButtons = document.createElement('div'); // контейнер для кнопок воспроизведения и остановки трека
  playlistButtons.classList.add('playlist-buttons');
  li.appendChild(playlistButtons); // Добавляем кнопки в элемент списка
  

  const playButton = document.createElement('button'); // Добавляем обработчик события для воспроизведения трека
  playButton.classList.add('playlist-button');
  playButton.textContent = 'Play';
  playButton.addEventListener('click', () => {
    updateCurrentSong(track);
    player.play();
  });
  playlistButtons.appendChild(playButton); // Добавляем кнопку в элемент списка

  const deleteButton = document.createElement('button'); // Добавляем обработчик события для удаления трека
  deleteButton.classList.add('playlist-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    playlistContainer.removeChild(li);
  });
  playlistButtons.appendChild(deleteButton); // Добавляем кнопку в элемент списка
}


searchButton.addEventListener('click', () => { // Обработчик клика по кнопке поиска
  const searchTerm = searchInput.value.toLowerCase();
  searchInput.value = '';

  const foundTracks = music.filter(track => track.artist.toLowerCase().includes(searchTerm) || 
  track.title.includes(searchTerm)); // Фильтруем треки

  foundTracks.forEach(track => {
    addTrackToPlaylist(track); // Добавляем трек в плейлист
  });
});


function chooseFile() { // Функция выбора файла, не перетаскивая из dropzone
  const input = document.createElement('input');
  input.type = 'file';

  input.onchange = function (e) {
    const file = e.target.files[0]; // Извлекаем выбранный файл
    addToPlaylist(file); // Добавляем трек в плейлист
  }
  input.click();
}


function initDropzone() { // Функция инициализации dropzone при перетаскивании файла
  const dropzone = document.getElementById('dropzone');

  dropzone.addEventListener('dragover', (e) => { // Событие при перетаскивании, браузер не откроет файл в новой вкладке
    e.preventDefault();
    e.stopPropagation(); // Останавливаем всплытие события
  });

  dropzone.addEventListener('drop', (e) => { // Событие при перетаскивании файла в dropzone
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0]; // dataTransfer отвечает за то, какие данные хранятся в элементе, который перетаскивается
    addToPlaylist(file); // Добавляем трек в плейлист
  });
}


function setSongInfo(file) { // Функция получения данных из выбранного файла
  const mp3Tags = new MP3Tag(file); // Инициализируем библиотеку для парсинга мета-тегов из аудиофайлов
  mp3Tags.read();

  const { v1: {title, artist}, v2: {APIC} } = mp3Tags.tags; // Деструктуризация объекта, чтобы получить нужные значения (название + автор, обложка)
  const coverBytes = APIC[0].data;
  const coverUrl = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(coverBytes))); // btoa преобразует байты в строку

  const art = document.getElementById('artist');
  song.textContent = title; // Заполняем поля информации о треке
  art.textContent = artist; 
  cover.src = coverUrl;
}


function addToPlaylist(file) { // Функция добавления трека в плейлист
  const li = document.createElement('li'); // Создаем новый элемент списка для трека
  li.classList.add('playlist-item');
  li.textContent = "• " + file.name; // Устанавливаем имя файла в качестве содержимого элемента списка
  playlistContainer.appendChild(li); // Добавляем элемент списка в плейлист

  const hr = document.createElement('div');
  hr.classList.add('hr-playlist');
  playlistContainer.appendChild(hr);

  const playlistButtons = document.createElement('div'); // контейнер для кнопок воспроизведения и остановки трека
  playlistButtons.classList.add('playlist-buttons');
  li.appendChild(playlistButtons); // Добавляем кнопки в элемент списка

  const playButton = document.createElement('button'); 
  playButton.classList.add('playlist-button');
  playButton.textContent = 'Play';
  playButton.addEventListener('click', () => { // Добавляем обработчик события для воспроизведения трека
    loadToPlayer(file);
    playTrack(file);
  });
  playlistButtons.appendChild(playButton); // Добавляем кнопку в элемент списка

  const deleteButton = document.createElement('button'); // Добавляем обработчик события для удаления трека
  deleteButton.classList.add('playlist-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    playlistContainer.removeChild(li);
  });
  playlistButtons.appendChild(deleteButton); // Добавляем кнопку в элемент списка
}

function playTrack(file) { // Функция воспроизведения трека
  player.src = URL.createObjectURL(file); // Загружаем ссылку на файл в плеер, делаем из массива байт URL и передаем в src
  player.load(); // Начинаем процессить этот файл и грузить контент
  player.play();
}


function loadToPlayer(file) { // Функция загрузки выбранного файла в плеер
  const reader = new FileReader(); // Создаем объект для чтения файла
  reader.onload = (e) => { // И на конец чтения
    const content = e.target.result; // контент файла сохраняем в объект target в свойстве result, где и массив байт
    setSongInfo(content); // и передаём в функцию setSongInfo
  }
  reader.readAsArrayBuffer(file) // reader должен прочитать наш файл как array-buffer

  player.src = URL.createObjectURL(file); // Загружаем ссылку на файл в плеер, делаем из массива байт URL и передаем в src
  player.load(); // Начинаем процессить этот файл и грузить контент
}


window.onload = () => { // Функция запуска при загрузке страницы
  initDropzone(); // Инициализируем dropzone
}

     // Отправка запроса на API Spotify:
  // const token = '437318674ab54652813ce5bc1bf8b1b2';
  // fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
  //   headers: {
  //       Authorization: `Bearer ${token}`,
  //   }
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //   // Обработка данных
  //   searchResults.innerHTML = ''; // Очищаем предыдущие результаты
    
  //   data.tracks.items.forEach(track => {
  //     // Создаем элемент с информацией о треке
  //   const trackElement = document.createElement('div');
  //   trackElement.textContent = `${track.artists[0].name} - ${track.name}`;
  //   searchResults.appendChild(trackElement); 
  //   });
  // })
  //   .catch(error => {
  //   console.error(error);
  // });