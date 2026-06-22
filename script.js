document.documentElement.classList.add("js-ready");

const scrollContainer = document.querySelector(".paper-screen");
const frame = document.querySelector("#compositionFrame");
const frameCount = 150;
const lastFrame = frameCount - 1;
const loadedFrames = new Map();
const frameDirectory = "images/컴포지션";
const frameNamePrefix = "컴포지션 1_";
const preloadBack = 3;
const preloadAhead = 8;
const cacheRadius = 16;

let activeFrame = 0;
let ticking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getFrameSrc = (index) => {
  const frameNumber = String(index).padStart(5, "0");
  return `${frameDirectory}/${frameNamePrefix}${frameNumber}.png`;
};

const preloadFrame = (index) => {
  if (index < 0 || index > lastFrame || loadedFrames.has(index)) {
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.src = getFrameSrc(index);
  loadedFrames.set(index, image);
};

const preloadAround = (index) => {
  for (let offset = -preloadBack; offset <= preloadAhead; offset += 1) {
    preloadFrame(index + offset);
  }
};

const trimLoadedFrames = (index) => {
  for (const frameIndex of loadedFrames.keys()) {
    if (Math.abs(frameIndex - index) > cacheRadius) {
      loadedFrames.delete(frameIndex);
    }
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
  trimLoadedFrames(activeFrame);
};

const requestFrameUpdate = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateFrame);
  }
};

preloadAround(0);
scrollContainer.addEventListener("scroll", requestFrameUpdate, {
  passive: true,
});
window.addEventListener("resize", requestFrameUpdate);
window.addEventListener("load", () => {
  requestFrameUpdate();
});
