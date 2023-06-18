let librarySongs = [];
let searchResults = [];

let libraryPath = localStorage.getItem("libraryPath");

function chooseLibraryPath() {
  ipcRenderer.invoke("choose-library-path").then((path) => {
    if (path) {
      libraryPath = path;
      localStorage.setItem("libraryPath", path);
      loadLibrary();
    }
  });
}

// Load all songs
function loadLibrary() {
  if (!libraryPath) return;
  fs.readdir(libraryPath, (err, files) => {
    if (err) throw err;
    librarySongs = files
      .filter((file) => path.parse(file).ext == ".pdf")
      .map((file) => path.parse(file).name);
    renderLibrary();
  });
}

function renderLibrary() {
  const query = document.getElementById("search").value.toLowerCase();
  const libraryList = document.getElementById("libraryList");
  libraryList.innerHTML = "";

  searchResults = librarySongs.filter((song) =>
    songNameMatchesQuery(song, query)
  );

  searchResults.forEach((song) => {
    const libraryItem = document.createElement("button");
    libraryItem.className = "librarySong";
    libraryItem.ariaLabel = song;
    libraryItem.innerText = `${song}`;
    if (playlist != null && playlist.includes(song)) {
      libraryItem.classList.add("added");
    } else {
      libraryItem.classList.remove("added");
    }
    libraryItem.onclick = function () {
      addToList(song);
    };
    libraryList.appendChild(libraryItem);
  });

  if (query) {
    document.getElementById("searchBar").classList.add("active");
  } else {
    document.getElementById("searchBar").classList.remove("active");
  }
}

function addFirstSearchResultToPlaylistׁׂ() {
  addToList(searchResults[0]);
}

function songNameMatchesQuery(songName, query) {
  const queryParts = query.toLowerCase().split(" ");
  // Split song name into parts by any non alphanumeric character
  const songParts = songName
    .toLowerCase()
    //FIXME: Searching for ש finds irrelevant songs
    .replace(/[^a-zA-Z0-9\u0590-\u05FF]+/g, " ")
    .split(" ");
  // Check if all query parts appear at the beginning of song parts
  return queryParts.every((queryPart) =>
    songParts.some((songPart) => songPart.startsWith(queryPart))
  );
}

function clearSearch() {
  document.getElementById("search").value = "";
  renderLibrary();
}

// Get selected song
function getSelectedSong() {
  const libraryList = document.getElementById("libraryList");
  const songs = Array.from(libraryList.getElementsByTagName("li"));

  // Assume the first visible song is the selected song
  const selectedSong = songs.find((song) => song.style.display !== "none");

  return selectedSong ? selectedSong.innerText : null;
}

//! -------- INFO SLIDE --------------

function chooseInfoSlide() {
  ipcRenderer.invoke("choose-info-slide").then((path) => {
    if (path) {
      infoSlidePath = path;
      localStorage.setItem("infoSlidePath", path);
      showInfoSlide();
    }
  });
}

let infoSlideShown = false;
function showInfoSlide(toShow = true) {
  if (toShow) {
    if (localStorage.getItem("infoSlidePath") == null) return;
    ipcRenderer.send(
      "present-song",
      `${localStorage.getItem("infoSlidePath")}#toolbar=0&view=Fit`
    );
    infoSlideShown = true;
  } else {
    showCurrentSlide();
    infoSlideShown = false;
  }
}
function toggleInfoSlide() {
  showInfoSlide(!infoSlideShown);
}
