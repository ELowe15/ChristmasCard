// --- Base folder for sound effects ---
const EFFECTS_FOLDER = 'Audio/Effects/';

// --- Sound file constants ---
const SOUND_LID_OPEN = null; // no lid sound for now
const SOUND_PAPER_TEAR = `${EFFECTS_FOLDER}paper-torn.mp3`;

class Present {
  static totalUnlocked = 0;
  static presents = [];

  constructor({
    folder,
    locked = false,
    triggerSongs = [],
    triggerPhotos = [],
    autoTransition = false,
    style = 'classic-red',
    width = null,
    height = null,
    hasLid = false,
    hasRibbon = false,
    colorVariant = '',
    ribbonStyle = 'classic',
    x = null, y = null
  }) {
    this.folder = folder;
    this.locked = locked;
    this.triggerSongs = triggerSongs;
    this.triggerPhotos = triggerPhotos;
    this.autoTransition = autoTransition;
    this.style = style;
    this.width = width;
    this.height = height;
    this.hasLid = hasLid;
    this.hasRibbon = hasRibbon;
    this.colorVariant = colorVariant;
    this.ribbonStyle = ribbonStyle;
    this.x = x;
    this.y = y;

    Present.presents.push(this);
    if (!locked) Present.totalUnlocked++;

    this.element = this.createElement();
    this.addListeners();
  }

  static showMessage(message) {
    const existing = document.querySelector('.message-box');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.className = 'message-box';

    const text = document.createElement('p');
    text.textContent = message;

    const button = document.createElement('button');
    button.textContent = 'OK';
    button.onclick = () => box.remove();

    box.appendChild(text);
    box.appendChild(button);
    document.body.appendChild(box);

    setTimeout(() => {
      if (box.parentNode) box.remove();
    }, 5000);
  }

  createElement() {
    const el = document.createElement('div');
    el.classList.add('present', this.style);
    el.dataset.folder = this.folder;
    el.dataset.locked = this.locked;

    if (this.x !== null && this.y !== null) {
      el.style.position = 'absolute';
      el.style.left = this.x;
      el.style.top = this.y;
    }

    if (this.hasLid) el.classList.add('has-lid');
    if (this.hasRibbon) el.classList.add('has-ribbon');
    if (this.colorVariant) el.classList.add(this.colorVariant);

    if (this.width) el.style.width = this.width;
    if (this.height) el.style.height = this.height;

    const box = document.createElement('div');
    box.classList.add('box');
    el.appendChild(box);

    if (this.hasLid) {
      const lid = document.createElement('div');
      lid.classList.add('lid');
      el.appendChild(lid);

      if (this.hasRibbon) {
        const ribbon = document.createElement('div');
        ribbon.classList.add('ribbon');
        ribbon.classList.add('ribbon-on-lid'); // ribbon moves with lid
        ribbon.classList.add(this.ribbonStyle);
        lid.appendChild(ribbon); // <-- append INSIDE lid
      }
    } else if (this.hasRibbon) {
      // ribbon on box
      const ribbon = document.createElement('div');
      ribbon.classList.add('ribbon', 'ribbon-on-box', this.ribbonStyle);
      el.appendChild(ribbon);
    }

    return el;
  }

  addListeners() {
    this.element.addEventListener('click', () => {
      if (this.locked) {
        if (Present.totalUnlocked > 0) {
          Present.showMessage("Save your best presents for last, open the other ones first!");
          return;
        } else {
          this.locked = false;
          this.element.dataset.locked = false;
        }
      }
      // Play the correct sound if it exists
      const soundFile = this.hasLid ? SOUND_LID_OPEN : SOUND_PAPER_TEAR;
      if (soundFile) new Audio(soundFile).play();

      if (this.hasLid) {
        // Trigger lid animation
        this.element.classList.add('opened');
      } 
      // Wait for CSS animation to finish before removing
      setTimeout(() => {
        this.finishOpening();
      }, 1000);
    });
  }

  finishOpening() {
    if (typeof Gallery !== 'undefined' && Gallery.open) {
      Gallery.open(this.folder, this.triggerSongs, this.triggerPhotos, this.autoTransition);
    }

    this.element.remove();
    Present.presents = Present.presents.filter(p => p !== this);

    if (!this.locked) {
      Present.totalUnlocked--;
    }
  }

  render(container) {
    container.appendChild(this.element);
  }

  static checkAllOpened() {
    if (Present.presents.length === 0) {
      Present.showMessage("Congratulations! You've opened all the presents!");
      createPresents();
      return true;
    }
    else {
      return false;
    }
  }
}

function createPresents() {
  const presentsContainer = document.getElementById('presents-container');

const presents = [
  new Present({
    x: '35%', y: '75%',
    folder: 'Bass',
    autoTransition: true,
    style: 'candy-cane-stripes',
    width: '5rem', height: '5rem',
    hasLid: true,
    hasRibbon: true,
    ribbonStyle: 'classic',
    triggerSongs: ['Rudolph.mp3']
  }),
  new Present({
    x: '0%', y: '75%',
    folder: 'Charlie',
    hasLid: true,
    autoTransition: true,
    style: 'charlie-stripes',
    width: '6rem', height: '4rem',
    hasRibbon: true,
    ribbonStyle: 'classic'
  }),
  new Present({
    x: '60%', y: '65%',
    folder: 'Film',
    style: 'film-reel-clean',
    width: '7.5rem', height: '5.5rem',
    locked: false,
    hasLid: true,
    hasRibbon: false,
    ribbonStyle: 'classic',
    triggerSongs: ['Mele Kalikimaka'],
    triggerPhotos: ['978E893A-17DE-40CB-8424-BEDDAC97DA70']
  }),
  new Present({
    x: '40%', y: '78%',
    folder: 'Games',
    style: 'games-pixels',
    width: '2.5rem', height: '3.5rem',
    hasRibbon: true,
    hasLid: false,
    ribbonStyle: 'classic',
    locked: true
  }),
  new Present({
    x: '65%', y: '70%',
    folder: 'Gremlin',
    autoTransition: true,
    style: 'gremlin-splatter',  // Keep your previous berry ombre style
    width: '6rem', height: '5rem',
    hasLid: true,
    hasRibbon: true,
    ribbonStyle: 'classic'
  }),
  new Present({
    x: '5%', y: '45%',
    folder: 'Grinch',
    autoTransition: true,
    style: 'grinch-fur', // Assuming you like the fur style from before
    width: '3rem', height: '10.5rem',
    hasLid: false,
    hasRibbon: true,
    ribbonStyle: 'classic',
    triggerSongs: ['Mr Grinch']
  }),
  new Present({
    x: '27%', y: '60%',
    folder: 'Muppets',
    autoTransition: true,
    style: 'muppets-confetti',
    width: '8.5rem', height: '9rem',
    hasRibbon: true,
    ribbonStyle: 'classic',
    triggerSongs: ['Scrooge']
  }),
];

  // First, render them in any order so they exist in the DOM
  presents.forEach(p => p.render(presentsContainer));

  // Now actually measure their visual bottom position
  presents.sort((a, b) => {
    const aRect = a.element.getBoundingClientRect();
    const bRect = b.element.getBoundingClientRect();

    const aBottom = aRect.bottom; // absolute bottom position in viewport
    const bBottom = bRect.bottom;

    return aBottom - bBottom; // lower bottoms come first, higher last
  });

  presentsContainer.querySelectorAll('.present').forEach(el => el.remove());
  presents.forEach(p => presentsContainer.appendChild(p.element));
}