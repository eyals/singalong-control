const fs = require("fs");
const path = require("path");


function savePlaylist(name, playlist) {
  fs.writeFile(
    path.join("playlists", `${name}.json`),
    JSON.stringify(playlist),
    (err) => {
      if (err) throw err;
      console.log("Playlist saved.");
    }
  );
}

function loadPlaylist(name) {
  fs.readFile(path.join("playlists", `${name}.json`), "utf-8", (err, data) => {
    if (err) throw err;
    return JSON.parse(data);
  });
}
