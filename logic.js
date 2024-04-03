const track = document.getElementById("image-track");
let touchStartX = 0;
let scrollStart = 0;

window.addEventListener("mousedown", (e) => {
  track.dataset.mouseDownAt = e.clientX;
});

window.addEventListener("mousemove", (e) => {
  if (track.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth;
  const percentage = (mouseDelta / maxDelta) * -100;
  let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
  if (nextPercentage > 0) {
    nextPercentage = 0;
  }
  if (nextPercentage < -100) {
    nextPercentage = -100;
  }

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`, // Corrected interpolation
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      { objectPosition: `${100 + nextPercentage}% center` }, // Corrected interpolation
      { duration: 1200, fill: "forwards" }
    );
  }
});

window.addEventListener("mouseup", () => {
  track.dataset.mouseDownAt = "0";
  if (track.dataset.percentage === undefined) {
    track.dataset.percentage = 0;
  }

  track.dataset.prevPercentage = track.dataset.percentage;
});

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // If two fingers are detected, start tracking the touch movement
    touchStartX = e.touches[0].clientX;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    // If two fingers are detected, calculate swipe direction
    const touchDeltaX = touchStartX - e.touches[0].clientX;
    const maxDelta = window.innerWidth;
    const percentage = (touchDeltaX / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    // Clamp nextPercentage between -100 and 0
    nextPercentage = Math.min(Math.max(nextPercentage, -100), 0);

    track.dataset.percentage = nextPercentage;

    track.animate(
      {
        transform: `translate(${nextPercentage}%, -50%)`, // Corrected interpolation
      }, { duration: 1200, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
      image.animate(
        { objectPosition: `${100 + nextPercentage}% center` }, // Corrected interpolation
        { duration: 1200, fill: "forwards" }
      );
    }
  }
});

window.addEventListener("touchend", () => {
  if (track.dataset.percentage === undefined) {
    track.dataset.percentage = 0;
  }

  track.dataset.prevPercentage = track.dataset.percentage;
});

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  // Calculate the delta of scroll position
  const scrollDelta = scrollPosition - scrollStart;

  // Adjust the position of the images based on the scroll delta
  const parallaxValue = scrollDelta * 0.5; // Adjust the parallax effect strength as needed

  for (const image of track.getElementsByClassName("image")) {
    image.style.transform = `translateX(${parallaxValue}px)`;
  }

  // Update the scroll start position
  scrollStart = scrollPosition;
});
