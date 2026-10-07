const video = document.querySelector('#hero-video');
const toggle = document.querySelector('.film-toggle');
if (video && toggle) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !motion.matches;
  let visible = true;
  const sync = () => { toggle.textContent = video.paused ? 'Play video' : 'Pause video'; };
  const shouldPlay = () => wantsPlayback && visible && !document.hidden;
  const update = () => {
    if (shouldPlay()) video.play().catch(sync);
    else video.pause();
  };
  // Keep native controls as the no-JavaScript fallback. One explicit control
  // owns playback intent when JavaScript is available; late media events must
  // never turn a user's Pause back into an autoplay request.
  video.controls = false;
  toggle.hidden = false;
  video.addEventListener('play', () => {
    if (!shouldPlay()) video.pause();
    sync();
  });
  video.addEventListener('pause', sync);
  toggle.addEventListener('click', () => {
    wantsPlayback = video.paused;
    update();
  });
  motion.addEventListener('change', () => { wantsPlayback = !motion.matches; update(); });
  document.addEventListener('visibilitychange', update);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.1 }).observe(video);
  sync();
}
