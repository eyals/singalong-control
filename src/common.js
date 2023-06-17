const fs = require("fs");
const path = require("path");

const { ipcRenderer } = require("electron");

document.addEventListener("keydown", function (event) {
  //F3 or CTRL+F to seqarch in library
  if (
    event.key === "F3" ||
    (event.key === "f" && (event.ctrlKey || event.metaKey))
  ) {
    event.preventDefault();
    document.getElementById("search").focus();
  }
  //ESC to exit library search
  if (event.key === "Escape") {
    event.preventDefault();
    document.getElementById("search").blur();
    clearSearch();
  }
  //Spacebar to advance slide (unless during search)
  if (event.key === " " || event.key === "ArrowDown") {
    if (document.activeElement === document.getElementById("search")) return;
    event.preventDefault();
    playlistNext();
  }
  //Arrow Up to move back a slide
  if (event.key === "ArrowUp") {
    event.preventDefault();
    playlistPrevious();
  }

  // Left/Right arrows to move songs in playlist
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
});
