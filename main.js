const player = document.getElementById('player');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');
const song = document.getElementById('song');
const playlistContainer = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');


function updateCurrentSong(track) { // Функция для обновления информации о текущем треке
  player.src = track.file;
  cover.src = track.coverSrc;
  artist.textContent = track.artist;
  song.textContent = track.title;
}

function addToPlaylist( item) { // Обработчик добавления треков в плейлист
  const li = document.createElement('li');
  li.classList.add('playlist-item');

  // Проверяем, является ли item объектом трека или файлом
  if (item.title && item.artist) {
    li.textContent = "• " + `${item.artist} - ${item.title}`; // Для объекта трека
  } else if (item.name) {
    li.textContent = "• " + item.name; // Для объекта файла
  } else {
    console.error('Invalid item type.'); // Обработка ошибки, если item не подходит
    return;
  }

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
  
  // Исправленный обработчик для воспроизведения
  playButton.addEventListener('click', async () => {
    if (item.title && item.artist) {
      updateCurrentSong(item); // Для объекта трека
      player.play();
    } else if (item.name) {
      try {
        const track = await processFile(item);
        updateCurrentSong(track);
        player.play();
      } catch (error) {
        console.error('Error loading file:', error);
      }
    }
  });
  playlistButtons.appendChild(playButton); // Добавляем кнопку в элемент списка

  const deleteButton = document.createElement('button'); // Добавляем обработчик события для удаления трека
  deleteButton.classList.add('playlist-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    playlistContainer.removeChild(li);
    playlistContainer.removeChild(hr);
  });
  playlistButtons.appendChild(deleteButton); // Добавляем кнопку в элемент списка
}

searchButton.addEventListener('click', async () => { // Обработчик клика по кнопке поиска
  const searchTerm = searchInput.value.toLowerCase();
  searchInput.value = '';
  const response = await fetch('music.json');
  const musicData = await response.json();
  const foundTracks = musicData.filter(track => 
    track.artist.toLowerCase().includes(searchTerm) || 
    track.title.toLowerCase().includes(searchTerm)
  );
  
  foundTracks.forEach(track => {
    addToPlaylist(track); // Добавляем трек в плейлист
  });
});


function chooseFile() { // Функция выбора файла, не перетаскивая в dropzone
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/*';

  input.onchange = function (e) {
    const file = e.target.files[0];
    addToPlaylist(file);
  };
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
    dropzone.style.backgroundColor = '';

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      addToPlaylist(file);
    }
  });
}

// Новая функция для обработки файлов
async function processFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const track = parseMetadata(content, file.name);
      resolve(track);
    };
    reader.readAsArrayBuffer(file);
  });
}

function parseMetadata(fileContent, fileName) {
  try {
    const mp3Tags = new MP3Tag(fileContent);
    mp3Tags.read();
    
    const tags = mp3Tags.tags;
    const track = {
      file: URL.createObjectURL(new Blob([fileContent])),
      title: fileName.replace(/\.[^.]+$/, ""),
      artist: "Unknown Artist",
      coverSrc: "default_cover.jpg"
    };

    // Извлекаем метаданные
    if (tags.v1) {
      track.title = tags.v1.title || track.title;
      track.artist = tags.v1.artist || track.artist;
    }
    if (tags.v2) {
      track.title = tags.v2.title || track.title;
      track.artist = tags.v2.artist || track.artist;
      
      if (tags.v2.APIC && tags.v2.APIC.length > 0) {
        const coverBytes = tags.v2.APIC[0].data;
        track.coverSrc = "data:image/png;base64," + 
          btoa(String.fromCharCode.apply(null, new Uint8Array(coverBytes)));
      }
    }

    return track;
  } catch (error) {
    console.error('Error reading tags:', error);
    return {
      file: URL.createObjectURL(new Blob([fileContent])),
      title: fileName.replace(/\.[^.]+$/, ""),
      artist: "Unknown Artist",
      coverSrc: "default_cover.jpg"
    };
  }
}

window.onload = () => { // Функция запуска при загрузке страницы
  initDropzone(); // Инициализируем dropzone
}