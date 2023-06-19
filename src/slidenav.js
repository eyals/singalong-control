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
	console.log(`${songPath}?r=${rnd}#toolbar=0&view=Fit&page=${slideNumber}`);
  songView.src = `${songPath}?r=${rnd}#toolbar=0&view=Fit&page=${slideNumber}`;
}
