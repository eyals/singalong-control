const fs = require("fs");
const path = require("path");

const { ipcRenderer } = require("electron");

//! --------- KEYBAORD SHORTCUTS ----------
document.addEventListener("keydown", function (event) {
  const searchField = document.getElementById("search");

  var isLetterKey = /^[A-Za-z\u0590-\u05FF]$/.test(event.key);
  if (isLetterKey && document.activeElement !== searchField) {
    searchField.focus();
    // searchField.value = event.key;
  }


  //Exit library search
  if (event.key === "Escape") {
    event.preventDefault();
    searchField.blur();
    clearSearch();
  }

  //Advance slide (unless during search)
  if (event.key === " " || event.key === "ArrowDown") {
    if (document.activeElement === searchField) return;
    event.preventDefault();
    playlistNext();
  }
  //Move back a slide
  if (event.key === "ArrowUp") {
    event.preventDefault();
    playlistPrevious();
  }

  // Move to next/previous song in playlist
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    jumpToPreviousSong();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    jumpToNextSong();
  }

  //Show/hide info slide
  if (event.key === "F12") {
    event.preventDefault();
    toggleInfoSlide();
  }

  //Add first search result to playlist
  if (event.key === "Enter") {
    if (searchField.value == "") return;
    event.preventDefault();
    addFirstSearchResultToPlaylistׁׂ();
    searchField.blur();
    clearSearch();
  }

  //Toggle full screen for audience window
  if (event.key === "F5") {
    event.preventDefault();
    ipcRenderer.invoke("toggle-fullscreen");
  }

});

function toggleHelp() {
  const helpElement = document.getElementById("help");
  if (helpElement.style.display !== "block") {
    helpElement.style.display = "block";
  } else {
    helpElement.style.display = "none";
  }
}
