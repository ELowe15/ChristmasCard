class Present {
  constructor({
    folder,
    locked = false,
    triggerSong = '',
    style = 'style-1',
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
    this.style = style;
    this.width = width;   // e.g. '6rem'
    this.height = height; // e.g. '4.5rem'
    this.hasLid = hasLid;
    this.hasRibbon = hasRibbon;
    this.colorVariant = colorVariant;
    this.ribbonStyle = ribbonStyle;
    this.x = x;
    this.y = y;

    this.element = this.createElement();
    this.addListeners(); // Comment this out if Gallery.open is not ready
  }

  createElement() {
    const el = document.createElement('div');
    el.classList.add('present', this.style);
    el.dataset.folder = this.folder;
    el.dataset.locked = this.locked;
    el.dataset.triggerSong = this.triggerSong;

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

    // Add main box element
    const box = document.createElement('div');
    box.classList.add('box');
    el.appendChild(box);

        // Add lid element if present
    if (this.hasLid) {
      const lid = document.createElement('div');
      lid.classList.add('lid');
      el.appendChild(lid);
    }

    if (this.hasRibbon) {
      const ribbon = document.createElement('div');
      ribbon.classList.add('ribbon');
      ribbon.classList.add(this.hasLid ? 'ribbon-on-lid' : 'ribbon-on-box');
      ribbon.classList.add(this.ribbonStyle); // Add style class for CSS

      el.appendChild(ribbon);
    }

    return el;
  }

  addListeners() {
    this.element.addEventListener('click', () => {
      if (this.locked === 'true' || this.locked === true) {
        alert("This present is locked. Please open other presents first.");
        return;
      }
      Gallery.open(this.folder, this.triggerSong);
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
      folder: 'gallery1', style: 'style-1', width: '6rem', height: '6rem',
      hasLid: true, hasRibbon: true, colorVariant: 'red', ribbonStyle: 'classic', triggerSong: 'song1.mp3'
    }),
    new Present({
      x: '35%', y: '68%',
      folder: 'gallery2', style: 'style-16', width: '5rem', height: '5rem',
      hasRibbon: true, colorVariant: 'blue', ribbonStyle: 'classic', locked: true
    }),
    new Present({
      x: '50%', y: '72%',
      folder: 'gallery3', style: 'style-3', width: '7rem', height: '4.5rem',
      hasLid: true, colorVariant: 'green', hasRibbon: true, ribbonStyle: 'classic', triggerSong: 'song2.mp3'
    }),
    new Present({
      x: '65%', y: '69%',
      folder: 'gallery4', style: 'style-14', width: '4.5rem', height: '6rem',
      hasRibbon: true, colorVariant: 'gold', ribbonStyle: 'classic'
    }),
    new Present({
      x: '30%', y: '80%',
      folder: 'gallery5', style: 'style-5', width: '6rem', height: '5rem',
      hasLid: true, hasRibbon: true, colorVariant: 'purple', ribbonStyle: 'classic', locked: true, triggerSong: 'song3.mp3'
    }),
    new Present({
      x: '45%', y: '78%',
      folder: 'gallery6', style: 'style-15', width: '5.5rem', height: '5.5rem',
      hasRibbon: true, colorVariant: 'orange', ribbonStyle: 'classic'
    }),
    new Present({
      x: '60%', y: '77%',
      folder: 'gallery7', style: 'style-12', width: '6rem', height: '6rem',
      hasLid: true, colorVariant: 'teal', hasRibbon: true, ribbonStyle: 'classic', triggerSong: 'song4.mp3'
    }),
    new Present({
      x: '40%', y: '75%',
      folder: 'gallery8', style: 'style-13', width: '4.8rem', height: '5.2rem',
      hasRibbon: true, colorVariant: 'pink', ribbonStyle: 'classic', locked: true
    })
  ];

  presents.forEach(p => p.render(presentsContainer));
}