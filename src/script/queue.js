const { ipcRenderer } = require("electron");
let songQueue = [];

// Add to queue and display in the queue list
function addToQueue(song) {
  if (!song) return;

  const queueList = document.getElementById("queueList");
  const existingItemIndex = Array.from(queueList.children).findIndex(
    (section) => section.textContent.includes(song)
  );

  // If the song already exists in the queue, remove it
  if (existingItemIndex !== -1) {
    songQueue.splice(existingItemIndex, 1);
    queueList.removeChild(queueList.children[existingItemIndex]);
  }

  songQueue.push(song);

  const listItem = document.createElement("section");
  listItem.innerText = song;

  // Add an 'onclick' listener to jump to the song when clicked
  listItem.onclick = function () {
    const index = Array.from(queueList.children).indexOf(listItem);
    presentSong(index);
  };

  // Add a 'remove' button
  const removeButton = document.createElement("a");
  removeButton.innerText = "🚫";
  removeButton.onclick = function (event) {
    event.stopPropagation(); // Prevent the list item 'onclick' from triggering
    removeFromQueue(listItem);
  };

  listItem.prepend(removeButton);

  queueList.appendChild(listItem);
}

// Remove from queue and from the queue list
function removeFromQueue(listItem) {
  const index = Array.from(listItem.parentElement.children).indexOf(listItem);
  songQueue.splice(index, 1);
  listItem.parentElement.removeChild(listItem);
}

// Jump to a song in the queue
function jumpToSong(index) {
  // Implement your code to jump to the song here
}

// Get current queue
function getQueue() {
  return songQueue;
}

// Present a song in the queue
function presentSong(index) {
  if (index < 0 || index >= songQueue.length) return;

  // Send a message to the main process to load the song in the audience view
  const songSlide = `${songQueue[index]}.pdf#toolbar=0&view=Fit&page=2`;
  ipcRenderer.send("present-song", songSlide);
}
