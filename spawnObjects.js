let snowInterval = 400; // default 0.5s in ms
let timerA, timerB;

function setSnowInterval(interval){
  snowInterval = interval;
}

function getSnowInterval(){
  return snowInterval;
}

// Start/Restart based on current settings
function startSnowTimers() {
  clearInterval(timerA);
  clearInterval(timerB);

  if (!isFinite(snowInterval)) {
    return; // Don't spawn anything if interval is Infinity
  }

  timerA = setInterval(spawnSnow, snowInterval);

  if (allowDualSnows) {
    timerB = setInterval(() => spawnSnow(true), snowInterval * 1.5);
  }
}

function updateSnowInterval(newSeconds) {
  snowInterval = newSeconds * 1000;
  startSnowTimers(); // reapply with new timing
}

function getSliderValueFromInterval(interval) {
  const minLog = Math.log(100);
  const maxLog = Math.log(10000);
  const logInterval = Math.log(interval);
  const scale = (logInterval - minLog) / (maxLog - minLog);
  return 100 - Math.round(scale * 100); // reverse
}

function getIntervalFromSliderValue(value) {
  if (value === 0) return Infinity;

  const minInterval = 100;    // fastest
  const maxInterval = 10000;  // slowest

  // Map slider 1–100 (we avoid 0 for log) to log scale
  const minLog = Math.log(minInterval);
  const maxLog = Math.log(maxInterval);

  const scale = (100 - value) / 100; // reverse slider
  const logInterval = minLog + scale * (maxLog - minLog);

  return Math.exp(logInterval);
}

function spawnSnow() {
  spawnFallingEmoji(["❄️"]);
}

function spawnFallingEmoji(
  emojiArray,
  {
    minFontSize = 20,
    maxFontSize = 40,
    minFallSpeed = 0.5,
    maxFallSpeed = 2.0,
    minSway = -1,
    maxSway = 1,
    opacity = 0.85,
    zIndex = 5
  } = {}
) {
  const emoji = document.createElement("div");
  emoji.textContent = emojiArray[Math.floor(Math.random() * emojiArray.length)];
  emoji.style.position = "fixed";
  emoji.style.top = "-50px";
  emoji.style.fontSize = Math.random() * (maxFontSize - minFontSize) + minFontSize + "px";
  emoji.style.opacity = opacity;
  emoji.style.zIndex = zIndex.toString();
  emoji.style.pointerEvents = 'none';

  const startLeft = Math.random() * window.innerWidth;
  emoji.style.left = `${startLeft}px`;

  document.body.appendChild(emoji);

  let y = -50;
  const fallSpeed = Math.random() * (maxFallSpeed - minFallSpeed) + minFallSpeed;
  const swayAmount = Math.random() * (maxSway - minSway) + minSway;

  const fallInterval = setInterval(() => {
    y += fallSpeed;
    const sway = Math.sin(y / 20) * swayAmount * 5;
    emoji.style.top = `${y}px`;
    emoji.style.left = `${startLeft + sway}px`;

    if (y > window.innerHeight + 50) {
      clearInterval(fallInterval);
      emoji.remove();
    }
  }, 16);
}