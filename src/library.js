let librarySongs = [];
// Load all songs
function loadSongs() {
  fs.readdir("library", (err, files) => {
    if (err) throw err;
    librarySongs = files.map((file) => path.parse(file).name);
    renderLibrary();
  });
}

function renderLibrary() {
  const query = document.getElementById("search").value.toLowerCase();
  const libraryList = document.getElementById("libraryList");
  libraryList.innerHTML = "";

  librarySongs.forEach((song) => {
    if (query && !song.toLowerCase().includes(query)) return;
    const libraryItem = document.createElement("button");
    libraryItem.className = "librarySong";
    libraryItem.ariaLabel = song;
    libraryItem.innerText = song;
    libraryItem.onclick = function () {
      addToList(song);
    };
    libraryList.appendChild(libraryItem);
  });
}


// Get selected song
function getSelectedSong() {
  const libraryList = document.getElementById("libraryList");
  const songs = Array.from(libraryList.getElementsByTagName("li"));

  // Assume the first visible song is the selected song
  const selectedSong = songs.find((song) => song.style.display !== "none");

  return selectedSong ? selectedSong.innerText : null;
}
