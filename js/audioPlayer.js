class AudioPlayer {
  constructor(audioSelector, nextBtnSelector, dropdownSelector, playlistUrl, basePath, fixedEndSongs = []) {
    if (AudioPlayer._instance) {
      return AudioPlayer._instance;
    }

    this.audio = document.querySelector(audioSelector);
    this.nextBtn = document.querySelector(nextBtnSelector);
    this.dropdown = document.querySelector(dropdownSelector);
    this.playlistUrl = playlistUrl;
    this.basePath = basePath;
    this.playlist = [];
    this.songMap = {};
    this.currentIndex = 0;
    this.fixedEndSongs = fixedEndSongs.map(name => name.toLowerCase()); // normalize fixed songs to lowercase

    this.init();

    AudioPlayer._instance = this;
  }

  async init() {
    try {
      const response = await fetch(this.playlistUrl);
      if (!response.ok) throw new Error("Failed to load playlist");
      this.playlist = await response.json();

      this.applyShuffleWithFixedEnd();

      this.buildSongMap();
      this.populateDropdown();
      this.bindEvents();
    } catch (err) {
      console.error("Error initializing audio player:", err);
    }
  }

  // Shuffle playlist but keep fixedEndSongs at the end in given order
  applyShuffleWithFixedEnd() {
    // Separate fixed end songs from others
    const lowerPlaylist = this.playlist.map(s => s.toLowerCase());
    const fixedSongs = [];
    const others = [];

    this.playlist.forEach(song => {
      if (this.fixedEndSongs.includes(song.toLowerCase())) {
        fixedSongs.push(song);
      } else {
        others.push(song);
      }
    });

    // Shuffle others (Fisher-Yates)
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }

    this.playlist = [...others, ...fixedSongs];
  }

  buildSongMap() {
    this.songMap = {};
    this.playlist.forEach((filename, index) => {
      const name = filename.replace(/\.mp3$/i, "").toLowerCase();
      this.songMap[name] = index;
    });
  }

  populateDropdown() {
    this.dropdown.innerHTML = ""; // Clear if any

    this.playlist.forEach((filename, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = filename.replace(/\.mp3$/i, "");
      this.dropdown.appendChild(option);
    });
  }

  bindEvents() {
    this.nextBtn.addEventListener("click", () => {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.playSong(this.currentIndex);
    });

    this.dropdown.addEventListener("change", (e) => {
      const selectedIndex = parseInt(e.target.value);
      if (!isNaN(selectedIndex)) {
        this.currentIndex = selectedIndex;
        this.playSong(this.currentIndex);
      }
    });

    this.audio.addEventListener("ended", () => {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.playSong(this.currentIndex);
    });
  }

  playSong(index) {
    const filename = this.playlist[index];
    this.audio.src = `${this.basePath}/${filename}`;
    this.dropdown.value = index;
    this.audio.play().catch(err => {
      console.error("Playback failed:", err);
    });
  }

  // New method: play by song name (without extension), case insensitive
  playSongByName(name) {
    const key = name.toLowerCase();
    if (key in this.songMap) {
      this.currentIndex = this.songMap[key];
      this.playSong(this.currentIndex);
    } else {
      console.warn(`Song "${name}" not found in playlist.`);
    }
  }

  // Optional: static method to get the single instance
  static getInstance(...args) {
    if (!AudioPlayer._instance) {
      AudioPlayer._instance = new AudioPlayer(...args);
    }
    return AudioPlayer._instance;
  }
}