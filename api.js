const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 80;

app.use(cors());

const audioData = [
  {
    "file": "music/Sin - Hard Ebm.mp3", 
    "artist": "Sin", 
    "title": "Hard Ebm", 
    "coverSrc": "img/Sin.png" 
  },
  { 
    "file": "music/Dark Techno EBM - Industrial Type Beat.mp3", 
    "artist": "Dark Techno EBM", 
    "title": "Industrial Type Beat", 
    "coverSrc": "img/No_cover.png" 
  },
  { 
    "file": "music/Drum and Bass - Atmospheric Drum and Bass.mp3", 
    "artist": "Drum and Bass", 
    "title": "Atmospheric Drum and Bass", 
    "coverSrc": "img/Atmospheric_Drum_and_Bass.png" 
  },
  { 
    "file": "music/Drum and Bass - Deep Drum and Bass.mp3", 
    "artist": "Drum and Bass", 
    "title": "Deep Drum and Bass", 
    "coverSrc": "img/Atmospheric_Drum_and_Bass.png" 
  },
  { 
    "file": "music/Drum and Bass - Jump up Drum and Bass.mp3", 
    "artist": "Drum and Bass", 
    "title": "Jump up Drum and Bass", 
    "coverSrc": "img/Jump_up_Drum_and_Bass.png" 
  },
  { 
    "file": "music/TWAN - Black Widow Industrial Techno.mp3", 
    "artist": "TWAN", 
    "title": "Black Widow Industrial Techno", 
    "coverSrc": "img/No_cover.png" 
  },
  { 
    "file": "music/lfilipe Techno Art - Whispers in the Dark.mp3", 
    "artist": "lfilipe Techno Art", 
    "title": "Whispers in the Dark", 
    "coverSrc": "img/lfilipe_Techno.png" 
  },
  { 
    "file": "music/Nyctonian - Influenceur Nyctonian Industrial.mp3", 
    "artist": "Nyctonian", 
    "title": "Influenceur Nyctonian Industrial Techno", 
    "coverSrc": "img/No_cover.png"
  }
];

// Эндпоинт для поиска аудио
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase();
  let results;
  if (!query) {
      results = audioData;
  } else {
      results = audioData.filter(track => {
          return track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
      });
  }
  res.json(results);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
