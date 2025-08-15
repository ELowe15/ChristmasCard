let audioCtx;
let crackleBuffer = null;
let crackleNode = null;
const fireplaceVideo = document.querySelector('.fireplace-video');

async function loadCrackleOnce(url = 'Audio/Effects/fire-crackling.m4a') {
  if (crackleBuffer) return crackleBuffer;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  crackleBuffer = await audioCtx.decodeAudioData(buf);
  return crackleBuffer;
}

async function startFireplace() {
  fireplaceVideo.currentTime = 0;
  fireplaceVideo.play().catch(err => {
    console.warn('Video play blocked', err);
    stopFireplace();
  });
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  if (crackleNode) return; // already playing
  const buffer = await loadCrackleOnce();
  crackleNode = audioCtx.createBufferSource();
  crackleNode.buffer = buffer;
  crackleNode.loop = true;      // gapless
  crackleNode.connect(audioCtx.destination);
  crackleNode.start();
}

function stopFireplace() {
  if (crackleNode) {
    crackleNode.stop();
    crackleNode.disconnect();
    crackleNode = null;
    fireplaceVideo.pause();
    fireplaceVideo.currentTime = 0;
  }
}