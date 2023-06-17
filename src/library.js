let librarySongs = [];

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

  librarySongs.forEach((song) => {
    if (query && !song.toLowerCase().includes(query)) return;
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
  console.log(toShow);
  console.log(localStorage.getItem("infoSlidePath"));
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
