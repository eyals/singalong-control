function presentSlide(songPath, slideNumber, totalSlides) {
  var songView = document.getElementById("songView");
  const songName = songPath.split("/").pop();
  if (songView.src.includes(encodeURIComponent(songName))) {
    console.log("same song, slide to " + slideNumber);
    // songView.contentWindow.scrollTo(
    //   0,
    //   (slideNumber / totalSlides) *
    //     songView.contentWindow.document.body.scrollHeight
    // );
  } else {
    console.log("new song, load " + songPath);
    // songView.src = `${songPath}#toolbar=0&view=Fit`;
  }
  const rnd = Math.random();
  const newUrl = `${songPath}?r=${rnd}#toolbar=0&view=Fit&page=${slideNumber}`;

  songView.style.opacity = 0;
  setTimeout(function () {
    songView.src = newUrl;

    // Wait for iframe to load the new content
    songView.onload = function () {
      setTimeout(function () {

      // Now fade the iframe back in
        songView.style.opacity = 1;
      }, 400);
    };
  }, 200);
}
