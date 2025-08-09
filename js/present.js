class Present {
  static totalUnlocked = 0;
  static presents = [];

  constructor({
    folder,
    locked = false,
    triggerSong = '',
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
    this.triggerSong = triggerSong;
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
        Gallery.open(this.folder, this.triggerSong, this.autoTransition );
      }

      // Remove from DOM after open
      this.element.remove();

      // Decrease unlocked counter if it was unlocked
      if (!this.locked) {
        Present.totalUnlocked--;
      }
    });
  }

  render(container) {
    container.appendChild(this.element);
  }
}

function createPresents() {
  const presentsContainer = document.getElementById('presents-container');

  const presents = [
    new Present({
      x: '20%', y: '70%',
      folder: 'Bass', autoTransition: true, style: 'classic-red', width: '6rem', height: '6rem',
      hasLid: true, hasRibbon: true, colorVariant: 'red', ribbonStyle: 'classic', triggerSong: 'song1.mp3'
    }),
    new Present({
      x: '35%', y: '68%',
      folder: 'Charlie', autoTransition: true, style: 'playful-green-stripes', width: '5rem', height: '5rem',
      hasRibbon: true, colorVariant: 'blue', ribbonStyle: 'classic'
    }),
    new Present({
      x: '50%', y: '72%',
      folder: 'Film', style: 'icy-blue-gradient', width: '7rem', height: '4.5rem', locked: true,
      hasLid: true, colorVariant: 'green', hasRibbon: true, ribbonStyle: 'classic', triggerSong: 'song2.mp3'
    }),
    new Present({
      x: '65%', y: '69%',
      folder: 'Games', style: 'berry-ombre', width: '4.5rem', height: '6rem',
      hasRibbon: true, colorVariant: 'gold', ribbonStyle: 'classic', locked: true
    }),
    new Present({
      x: '30%', y: '80%',
      folder: 'Gremlin', autoTransition: true, style: 'creamy-green-polka', width: '6rem', height: '5rem',
      hasLid: true, hasRibbon: true, colorVariant: 'purple', ribbonStyle: 'classic', triggerSong: 'song3.mp3'
    }),
    new Present({
      x: '60%', y: '77%',
      folder: 'Grinch', autoTransition: true, style: 'big-cranberry-polka', width: '6rem', height: '6.5rem',
      hasLid: true, colorVariant: 'teal', hasRibbon: true, ribbonStyle: 'classic', triggerSong: 'song4.mp3'
    }),
    new Present({
      x: '40%', y: '75%',
      folder: 'Muppets', autoTransition: true, style: 'soft-aqua-grid', width: '4.8rem', height: '5.2rem',
      hasRibbon: true, colorVariant: 'pink', ribbonStyle: 'classic'
    })
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