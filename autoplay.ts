console.log('autoplay');

const videos = document.querySelectorAll('video');
// Use intersection observer to play videos when they are in view, and pause them when they are not. Place currentTime at 0 when they are in view.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('playing', entry.target);
      entry.target.play();
      entry.target.currentTime = 0;
    } else {
      console.log('pausing', entry.target);
      entry.target.pause();
    }
  });
});

videos.forEach((video) => {
  observer.observe(video);
});
