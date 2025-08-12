class Gallery {
  static container = document.getElementById('gallery-container');
  static baseEncryptedFolder = 'EncryptedPhotos'; // your root folder
  static currentFolder = null;
  static currentImages = []; // array of blob URLs or null placeholders for lazy load
  static currentIndex = 0;
  static autoTransition = false;
  static autoTransitionTimeoutId = null;
  static snowControls = document.getElementById('snowSliderContainer');
  static savedSnowInterval;
  // Configurable timing
  static fadeDuration = 3000; // ms, fade in/out speed
  static autoTransitionDelay = 2000; // ms, delay before auto transition to next image

  // Flags which loading mode to use
  static preloadAllImages = false;
  static isTransitioning = false;

  static async open(folder, triggerSong, autoTransition = false, preloadAllImages = false) {
    this.currentFolder = `${this.baseEncryptedFolder}/${folder}`;
    this.currentIndex = 0;
    this.autoTransition = autoTransition;
    this.preloadAllImages = preloadAllImages;

    // Hide card and snow controls
    cardSwipeEnabled = false;
    document.getElementById("card-wrapper").style.display = "none";
    if (this.snowControls){
      this.savedSnowInterval = getSnowInterval()/1000;
      updateSnowInterval(Infinity);
      this.snowControls.style.display = "none";
    }

    this.container.style.display = "flex";

    // Setup buttons
    const prevBtn = this.container.querySelector('button.prev');
    const nextBtn = this.container.querySelector('button.next');
    const closeBtn = this.container.querySelector('button.close');
    if (prevBtn) prevBtn.onclick = () => {
      if (!this.isTransitioning) this.showImage(this.currentIndex - 1);
    };
    if (nextBtn) nextBtn.onclick = () => {
      if (!this.isTransitioning) this.showImage(this.currentIndex + 1);
    };
    if (closeBtn) closeBtn.onclick = () => {
      if (!this.isTransitioning) this.close();
    };

    // Setup swipe handlers for mobile
    this.setupSwipeHandlers();

    if (this.preloadAllImages) {
      await this.loadAllImages(this.currentFolder);
      this.showImage(0);
    } else {
      await this.loadImageList(this.currentFolder);
      this.showImage(0);
    }

    // Auto transition first -> second image if enabled
    if (this.autoTransition && this.currentImages.length > 1) {
      this.isTransitioning = true;
      [prevBtn, nextBtn, closeBtn].forEach(btn => {
        if (btn) btn.style.visibility = 'hidden';
    });
      this.autoTransitionTimeoutId = setTimeout(() => {
        this.fadeToImage(1);
      }, this.autoTransitionDelay);
    }
  }

  static async loadAllImages(folder) {
    if (!riddleKey) {
      alert("Decryption key not available. Please enter a valid passphrase.");
      return;
    }
    const imagePaths = await fetchEncryptedList(`${folder}/index.json`, folder);
    if (!imagePaths.length) return;

    this.currentImages = [];
    for (const path of imagePaths) {
      try {
        const blob = await decryptImage(path, riddleKey);
        const url = URL.createObjectURL(blob);
        this.currentImages.push(url);
      } catch (err) {
        console.error(`❌ Failed to decrypt ${path}:`, err);
        this.currentImages.push(null);
      }
    }
  }

  static async loadImageList(folder) {
    if (!riddleKey) {
      alert("Decryption key not available. Please enter a valid passphrase.");
      return;
    }
    const imagePaths = await fetchEncryptedList(`${folder}/index.json`, folder);
    if (!imagePaths.length) return;
    this.imagePaths = imagePaths;
    this.currentImages = new Array(imagePaths.length).fill(null);
  }

  static async loadImage(index) {
    if (this.currentImages[index]) return this.currentImages[index];
    try {
      const blob = await decryptImage(this.imagePaths[index], riddleKey);
      const url = URL.createObjectURL(blob);
      this.currentImages[index] = url;
      return url;
    } catch (err) {
      console.error(`❌ Failed to decrypt image at index ${index}:`, err);
      return null;
    }
  }

  static async showImage(index) {
    if (index < 0) index = this.currentImages.length - 1;
    if (index >= this.currentImages.length) index = 0;
    this.currentIndex = index;

    if (this.autoTransitionTimeoutId) {
      clearTimeout(this.autoTransitionTimeoutId);
      this.autoTransitionTimeoutId = null;
    }

    const oldImg = this.container.querySelector('img');
    if (oldImg) oldImg.remove();

    let imgSrc = this.currentImages[index];
    if (!imgSrc) imgSrc = await this.loadImage(index);
    if (!imgSrc) {
      console.warn(`Image at index ${index} not available.`);
      return;
    }

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Image ${index + 1}`;
    this.container.insertBefore(img, this.container.firstChild);

    img.onload = () => console.log(`Image ${index + 1} loaded.`);

    preloadNextImage(index);
  }

  static async preloadNextImage(index){
    //code to preload next image
    const nextIndex = (index + 1) % this.currentImages.length;
    if (!this.currentImages[nextIndex]) {
      this.loadImage(nextIndex).then(() => {
        console.log(`Preloaded image ${nextIndex + 1}`);
      }).catch(() => {
        console.warn(`Failed to preload image ${nextIndex + 1}`);
      });
    }
  }

  static fadeToImage(index) {
    const prevBtn = this.container.querySelector('button.prev');
    const nextBtn = this.container.querySelector('button.next');
    const closeBtn = this.container.querySelector('button.close');

    const oldImg = this.container.querySelector('img');

    const newImg = document.createElement('img');
    newImg.style.position = 'absolute';
    newImg.style.top = '0';
    newImg.style.left = '0';
    newImg.style.width = '100%';
    newImg.style.height = '100%';
    newImg.style.objectFit = 'contain';
    newImg.style.opacity = '0';
    newImg.style.transition = `opacity ${this.fadeDuration}ms ease`;
    newImg.alt = `Image ${index + 1}`;
    this.container.appendChild(newImg);

    (async () => {
      let imgSrc = this.currentImages[index];
      if (!imgSrc) imgSrc = await this.loadImage(index);
      if (!imgSrc) return;

      newImg.src = imgSrc;
      newImg.onload = () => {
        newImg.style.opacity = '1';
        if (oldImg) {
          oldImg.style.transition = `opacity ${this.fadeDuration}ms ease`;
          oldImg.style.opacity = '0';
          setTimeout(() => {
            if (oldImg && oldImg.parentNode) oldImg.remove();

            this.isTransitioning = false;
            [prevBtn, nextBtn, closeBtn].forEach(btn => {
              if (btn) btn.style.visibility = '';
            });

            preloadNextImage(index);
          }, this.fadeDuration);
        }
        this.currentIndex = index;
      }
    })();
  }

static close() {
  this.container.style.display = "none";

  // Remove all images inside the container
  const imgs = this.container.querySelectorAll('img');
  imgs.forEach(img => {
    if (img.src) URL.revokeObjectURL(img.src); // revoke URL safely if needed
    img.remove();
  });

  // Clear image URLs array
  this.currentImages = [];
  this.imagePaths = [];
  this.currentFolder = null;
  this.currentIndex = 0;
  this.autoTransition = false;

  cardSwipeEnabled = true;
  document.getElementById("card-wrapper").style.display = "flex";

  if (this.snowControls){
    this.snowControls.style.display = "";
    updateSnowInterval(this.savedSnowInterval); // your fix
  }
}

  static setupSwipeHandlers() {
    if (this.touchHandlerSetup) return;
    this.touchHandlerSetup = true;

    let startX = 0, startY = 0, isMoving = false;

    this.container.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isMoving = true;
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      if (!isMoving) return;
      isMoving = false;
      let dx = e.changedTouches[0].clientX - startX;
      let dy = e.changedTouches[0].clientY - startY;
      if (!this.isTransitioning && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        if (dx > 0) this.showImage(this.currentIndex - 1);
        else this.showImage(this.currentIndex + 1);
      }
    }, { passive: true });
  }
}
