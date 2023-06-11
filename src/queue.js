let songQueue = [];
loadQueue();

// Add to queue and display in the queue list
function addToQueue(song) {
  if (!song) return;
  // If the song already exists in the queue, remove it (it will be added to the end)
  // removeFromQueue(song);
  songQueue.push(song);
  updateQueue();
}

// Remove from queue and from the queue list
function removeFromQueue(song) {
  if (!song || !songQueue.includes(song)) return;
  songQueue.splice(songQueue.indexOf(song), 1);
  updateQueue();
}

function updateQueue() {
  // Build the queue display
  const queueList = document.getElementById("queueList");
  queueList.innerHTML = "";
  songQueue.forEach((song) => {
    const queueItem = document.createElement("section");
    queueItem.className = "queueItem";
    queueItem.ariaLabel = song;
    queueItem.draggable = true;

    const listText = document.createElement("button");
    listText.className = "songName";
    listText.innerText = song;
    listText.onclick = function () {
      presentSong(song);
    };
    queueItem.appendChild(listText);

    // Add a 'remove' button
    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.innerText = "🚫";
    removeButton.onclick = function () {
      removeFromQueue(song);
    };
    queueItem.appendChild(removeButton);

    queueList.appendChild(queueItem);
  });

  // Update the queue file
  const queueFilePath = path.resolve("./data/queue.txt");
  fs.writeFile(queueFilePath, songQueue.join("\n"), (err) => {
    if (err) {
      console.log("Failed to write queue file");
      return console.log(err);
    }
    console.log("Queue file updated");
  });
}

// Jump to a song in the queue
function jumpToSong(index) {
  // Implement your code to jump to the song here
}

// Get current queue
function getQueue() {
  return songQueue;
}

function loadQueue() {
  const queueFilePath = path.resolve("./data/queue.txt");
  fs.readFile(queueFilePath, "utf8", (err, data) => {
    if (err) {
      console.log("Failed to read queue file");
      return console.log(err);
    }
    songQueue = data.split("\n");
    updateQueue();
  });
}

// Present a song in the queue
function presentSong(song) {
  // Send a message to the main process to load the song in the audience view
  const songSlide = `${song}.pdf#toolbar=0&view=Fit&page=2`;
  ipcRenderer.send("present-song", songSlide);
}

let draggedQueueItem = null;

// event fired when the dragging starts
document.addEventListener("dragstart", (event) => {
  if (event.target.className == "queueItem") {
    draggedQueueItem = event.target.ariaLabel;
  } else {
    draggedQueueItem = null;
  }
});

// event fired when the dragged element enters a drop target
document.addEventListener("dragover", (event) => {
  event.preventDefault(); // prevent default to allow drop
});

// event fired when the dragged element is dropped into a target
document.addEventListener("drop", (event) => {
  event.preventDefault(); // prevent default action
  if (draggedQueueItem == null) return;
  removeFromQueue(draggedQueueItem);
  let dropTargetIndex;;

  if (["queueItem", "songName", "remove"].includes(event.target.className)) {
    const containingQueueItem = findContainingQueueItem(event.target);
    console.log(containingQueueItem);
    dropTargetIndex = songQueue.indexOf(containingQueueItem.ariaLabel);
  } else {
    dropTargetIndex = songQueue.length;
  }
  songQueue.splice(dropTargetIndex, 0, draggedQueueItem);
  draggedQueueItem = null;
  updateQueue();
});

// Find the queue item that contains the given element (recursively)
function findContainingQueueItem(element) {
  if (element.className == "queueItem") {
    return element;
  } else if (element.parentElement) {
    return findContainingQueueItem(element.parentElement);
  } else {
    return null;
  }
}

function savePlaylist(name, playlist) {
  ipcRenderer.invoke("save-list-dialog").then((filePath) => {
    console.log(filePath);
  });
}

function loadPlaylist(name) {
  ipcRenderer.invoke("open-list-dialog").then((filePath) => {
    console.log(filePath);
  });
}
