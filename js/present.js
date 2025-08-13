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
    }

    if (this.hasRibbon) {
      const ribbon = document.createElement('div');
      ribbon.classList.add('ribbon');
      ribbon.classList.add(this.hasLid ? 'ribbon-on-lid' : 'ribbon-on-box');
      ribbon.classList.add(this.ribbonStyle);
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

      // Open the present
      if (typeof Gallery !== 'undefined' && Gallery.open) {
        Gallery.open(this.folder, this.triggerSongs, this.triggerPhotos, this.autoTransition );
      }

      // Remove from DOM after open
      this.element.remove();

      // Remove this instance from the list
      Present.presents = Present.presents.filter(p => p !== this);

      // Decrease unlocked counter if it was unlocked
      if (!this.locked) {
        Present.totalUnlocked--;
      }
    });
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
    width: '6rem', height: '6rem',
    hasLid: true,
    hasRibbon: true,
    colorVariant: 'gold',
    ribbonStyle: 'classic',
    triggerSongs: ['Rudolph.mp3']
  }),
  new Present({
    x: '0%', y: '75%',
    folder: 'Charlie',
    hasLid: true,
    autoTransition: true,
    style: 'charlie-stripes',
    width: '7rem', height: '5rem',
    hasRibbon: true,
    colorVariant: 'brown',
    ribbonStyle: 'classic'
  }),
  new Present({
    x: '55%', y: '65%',
    folder: 'Film',
    style: 'film-reel-clean',
    width: '10rem', height: '6.5rem',
    locked: false,
    hasLid: true,
    hasRibbon: false,
    colorVariant: 'black-white',
    ribbonStyle: 'classic',
    triggerSongs: ['Mele Kalikimaka'],
    triggerPhotos: ['978E893A-17DE-40CB-8424-BEDDAC97DA70']
  }),
  new Present({
    x: '40%', y: '73%',
    folder: 'Games',
    style: 'games-pixels',
    width: '3.5rem', height: '3.5rem',
    hasRibbon: true,
    hasLid: false,
    colorVariant: 'red-white',
    ribbonStyle: 'classic',
    locked: true
  }),
  new Present({
    x: '15%', y: '80%',
    folder: 'Gremlin',
    autoTransition: true,
    style: 'gremlin-splatter',  // Keep your previous berry ombre style
    width: '6rem', height: '5rem',
    hasLid: true,
    hasRibbon: true,
    colorVariant: 'purple',
    ribbonStyle: 'classic'
  }),
  new Present({
    x: '5%', y: '45%',
    folder: 'Grinch',
    autoTransition: true,
    style: 'grinch-fur', // Assuming you like the fur style from before
    width: '3rem', height: '10.5rem',
    hasLid: true,
    colorVariant: 'olive',
    hasRibbon: true,
    ribbonStyle: 'classic',
    triggerSongs: ['Mr Grinch']
  }),
  new Present({
    x: '27%', y: '63%',
    folder: 'Muppets',
    autoTransition: true,
    style: 'muppets-confetti',
    width: '8.5rem', height: '9rem',
    hasRibbon: true,
    colorVariant: 'multi',
    ribbonStyle: 'classic',
    triggerSongs: ['Scrooge']
  }),
];


// Dynamically get actual rem size
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const containerHeight = window.innerHeight;

  // Sort by visual bottom position
  presents.sort((a, b) => {
    const aY = parseFloat(a.y) / 100 * containerHeight;
    const bY = parseFloat(b.y) / 100 * containerHeight;
    const aHeight = parseFloat(a.height) * remInPx;
    const bHeight = parseFloat(b.height) * remInPx;

    const aBottom = aY + aHeight;
    const bBottom = bY + bHeight;

    return aBottom - bBottom;
  });

  presents.forEach(p => p.render(presentsContainer));
}