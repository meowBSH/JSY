document.documentElement.classList.add("js-ready");

const scrollContainer = document.querySelector(".paper-screen");
const frame = document.querySelector("#typographyFrame");
const frameCount = 150;
const lastFrame = frameCount - 1;
const loadedFrames = new Map();

let activeFrame = 0;
let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getFrameSrc = (index) => {
  const frameNumber = String(index).padStart(5, "0");
  return `assets/typogra/typogra_${frameNumber}.jpg`;
};

const preloadFrame = (index) => {
  if (index < 0 || index > lastFrame || loadedFrames.has(index)) {
    return;
  }

  const image = new Image();
  image.src = getFrameSrc(index);
  loadedFrames.set(index, image);
};

const preloadAround = (index) => {
  for (let offset = -3; offset <= 8; offset += 1) {
    preloadFrame(index + offset);
  }
};

const updateFrame = () => {
  ticking = false;

  const scrollableDistance =
    scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const progress =
    scrollableDistance <= 0
      ? 0
      : scrollContainer.scrollTop / scrollableDistance;
  const nextFrame = clamp(Math.round(progress * lastFrame), 0, lastFrame);

  if (nextFrame !== activeFrame) {
    activeFrame = nextFrame;
    frame.src = getFrameSrc(activeFrame);
    frame.dataset.frame = String(activeFrame);
  }

  preloadAround(activeFrame);
};

const requestFrameUpdate = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateFrame);
  }
};

const preloadAllFrames = () => {
  let index = 0;

  const queueNext = () => {
    preloadFrame(index);
    index += 1;

    if (index < frameCount) {
      window.setTimeout(queueNext, 16);
    }
  };

  queueNext();
};

preloadAround(0);
scrollContainer.addEventListener("scroll", requestFrameUpdate, {
  passive: true,
});
window.addEventListener("resize", requestFrameUpdate);
window.addEventListener("load", () => {
  requestFrameUpdate();
  preloadAllFrames();
});
