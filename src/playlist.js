
let playlist;
let listTitle;
const newPlaylistTitle = "New Playlist";

loadActivePlaylist();

// Add song to playlist
function addToList(song) {
  if (!song) return;
  // If the song already exists in the list, remove it (it will be added to the end)
  removeFromPlaylist(song);
  playlist.push(song);
  updatePlaylist();
}

// Remove song from list
function removeFromPlaylist(song) {
  if (!song || !playlist.includes(song)) return;
  playlist.splice(playlist.indexOf(song), 1);
  updatePlaylist();
}

// Update the displayed list and save changes to the playlist file
function updatePlaylist() {
  // Build the list display
  const playlistEl = document.getElementById("playlistSongs");
  playlistEl.innerHTML = "";
  playlist.forEach((song) => {
    const listItem = document.createElement("section");
    listItem.className = "listItem";
    listItem.ariaLabel = song;
    listItem.draggable = true;

    const listText = document.createElement("button");
    listText.className = "songName";
    listText.innerText = song;
    listText.onclick = function () {
      presentSong(song);
    };
    listItem.appendChild(listText);

    // Add a 'remove' button
    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.innerText = "🚫";
    removeButton.onclick = function () {
      removeFromPlaylist(song);
    };
    listItem.appendChild(removeButton);

    playlistEl.appendChild(listItem);
  });

  savePlaylist();
}

// Present a song in the list
function presentSong(song) {
  // Send a message to the main process to load the song in the audience view
  const songSlide = `${song}.pdf#toolbar=0&view=Fit&page=2`;
  ipcRenderer.send("present-song", songSlide);
}

//! --------- DRAGGING ----------

let draggedlistItem = null;

// event fired when the dragging starts
document.addEventListener("dragstart", (event) => {
  if (event.target.className == "listItem") {
    draggedlistItem = event.target.ariaLabel;
  } else {
    draggedlistItem = null;
  }
});

// event fired when the dragged element enters a drop target
document.addEventListener("dragover", (event) => {
  event.preventDefault(); // prevent default to allow drop
});

// event fired when the dragged element is dropped into a target
document.addEventListener("drop", (event) => {
  event.preventDefault(); // prevent default action
  if (draggedlistItem == null) return;
  removeFromPlaylist(draggedlistItem);
  let dropTargetIndex;

  if (["listItem", "songName", "remove"].includes(event.target.className)) {
    const containinglistItem = findContaininglistItem(event.target);
    console.log(containinglistItem);
    dropTargetIndex = playlist.indexOf(containinglistItem.ariaLabel);
  } else {
    dropTargetIndex = playlist.length;
  }
  playlist.splice(dropTargetIndex, 0, draggedlistItem);
  draggedlistItem = null;
  updatePlaylist();
});

// Find the playlist item that contains the given element (recursively)
function findContaininglistItem(element) {
  if (element.className == "listItem") {
    return element;
  } else if (element.parentElement) {
    return findContaininglistItem(element.parentElement);
  } else {
    return null;
  }
}

function clearList() {
  localStorage.setItem("listFilePath", unsavedListPath());
  playlist = [];
  updatePlaylist();
  updatePlaylistTitle();
}

function updatePlaylistTitle() {
  const filePath = localStorage.getItem("listFilePath") ?? unsavedListPath();
  listTitle = filePath.split("/").pop();
  if (listTitle.includes(".")) listTitle = listTitle.split(".")[0];
  document.getElementById("playlistTitle").innerText = listTitle;
}

function unsavedListPath() {
  return path.resolve(`./data/${newPlaylistTitle}.txt`);
}

//! --------- LOADING AND SAVING ----------

// Load the active playlist from the last session, or the default list if none exists
function loadActivePlaylist() {
  const filePath = localStorage.getItem("listFilePath") ?? unsavedListPath();
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Failed to read playlist file");
      clearList();
    } else {
      playlist = data.trim().split("\n");
    }
    updatePlaylist();
    updatePlaylistTitle();
  });
}

function openPlaylistFile() {
  ipcRenderer.invoke("open-list-dialog").then((filePath) => {
    localStorage.setItem("listFilePath", filePath);
    loadActivePlaylist();
  });
}

function savePlaylist() {
  const filePath = localStorage.getItem("listFilePath") ?? unsavedListPath();
  fs.writeFile(filePath, playlist.join("\n"), (err) => {
    if (err) console.log(err);
  });
}

function savePlaylistAs() {
  ipcRenderer.invoke("save-list-dialog").then((filePath) => {
    localStorage.setItem("listFilePath", filePath);
    savePlaylist();
    updatePlaylistTitle();
  });
}
