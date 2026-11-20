// Start the next visible video in this frame after normal playback ends.
document.addEventListener("ended", async (event) => {
  const current = event.target;
  if (!(current instanceof HTMLVideoElement) || !current.ended || document.hidden) return;
  const videos = [...document.querySelectorAll("video")];
  const index = videos.indexOf(current);
  if (index < 0) return;

  const next = videos.slice(index + 1).find((video) =>
    !video.ended && video.paused && video.getClientRects().length > 0 &&
    getComputedStyle(video).visibility === "visible"
  );
  if (!next) return;

  // Browser autoplay policy can require another manual click.
  try {
    await next.play();
  } catch (error) {
    console.debug("学习通伴学：请手动播放下一段视频。", error.name);
  }
}, true);
