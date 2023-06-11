const fs = require("fs");
const path = require("path");



// Load all songs
function loadSongs() {
  fs.readdir("library", (err, files) => {
    if (err) throw err;

    const songList = document.getElementById('songList');

    // Clear existing songs
    songList.innerHTML = '';

    // Add each song to the list
    files.forEach(file => {
      const listItem = document.createElement('section');
      listItem.innerText = path.parse(file).name;

      // Add 'onclick' listener to add the song to queue when clicked
      listItem.onclick = function() {
        addToQueue(path.parse(file).name);
      };

      songList.appendChild(listItem);
    });
  });
}

// Filter songs
function filterSongs() {
  const query = document.getElementById("search").value.toLowerCase();

  const songList = document.getElementById("songList");
  const songs = Array.from(songList.getElementsByTagName("li"));

  // Hide songs that do not match the query
  songs.forEach((song) => {
    const title = song.innerText.toLowerCase();
    song.style.display = title.includes(query) ? "" : "none";
  });
}

// Get selected song
function getSelectedSong() {
  const songList = document.getElementById("songList");
  const songs = Array.from(songList.getElementsByTagName("li"));

  // Assume the first visible song is the selected song
  const selectedSong = songs.find((song) => song.style.display !== "none");

  return selectedSong ? selectedSong.innerText : null;
}
