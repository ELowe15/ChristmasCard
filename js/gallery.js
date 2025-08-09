class Gallery {
  static container = document.getElementById('gallery-container');
  static baseEncryptedFolder = 'EncryptedPhotos'; // your root folder
  static currentFolder = null;
  static currentImages = []; // array of blob URLs or null placeholders for lazy load
  static currentIndex = 0;
  static autoTransition = false;
  static autoTransitionTimeoutId = null;
  static galleryIsOpen = false;
  static snowControls = document.getElementById('snowSliderContainer');

  // Flags which loading mode to use
  // true = preload all images before showing gallery
  // false = lazy load images as user navigates
  static preloadAllImages = false;

  static async open(folder, triggerSong, autoTransition = false, preloadAllImages = false) {
    this.currentFolder = `${this.baseEncryptedFolder}/${folder}`;
    this.currentIndex = 0;
    this.autoTransition = autoTransition;
    this.preloadAllImages = preloadAllImages;

    // Hide card and snow controls
    document.getElementById("card-wrapper").style.display = "none";
    if (this.snowControls) this.snowControls.style.display = "none";

    this.container.style.display = "flex";
    this.galleryIsOpen = true;

    // Disable card swipe globally (you must implement this in your card swipe logic)
    window.galleryIsOpen = true;

    // Setup buttons
    const prevBtn = this.container.querySelector('button.prev');
    const nextBtn = this.container.querySelector('button.next');
    const closeBtn = this.container.querySelector('button.close');

    if (prevBtn) prevBtn.onclick = () => this.showImage(this.currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => this.showImage(this.currentIndex + 1);
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Setup swipe handlers for mobile
    this.setupSwipeHandlers();

    if (this.preloadAllImages) {
      // Load all images first, then show gallery with first image
      await this.loadAllImages(this.currentFolder);
      this.showImage(0);
    } else {
      // Lazy load: load index.json, but only load first image now
      await this.loadImageList(this.currentFolder);
      this.showImage(0);
    }

    // Auto transition first -> second image after 2s if enabled
    if (this.autoTransition && this.currentImages.length > 1) {
      this.autoTransitionTimeoutId = setTimeout(() => {
        this.showImage(1);
      }, 2000);
    }
  }

  // Load all images fully, store blob URLs in currentImages
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
        this.currentImages.push(null); // placeholder so indexes remain consistent
      }
    }
  }

  // Lazy load image list only, fill currentImages with null placeholders
  static async loadImageList(folder) {
    if (!riddleKey) {
      alert("Decryption key not available. Please enter a valid passphrase.");
      return;
    }
    const imagePaths = await fetchEncryptedList(`${folder}/index.json`, folder);
    if (!imagePaths.length) return;
    this.imagePaths = imagePaths; // save paths for lazy loading later
    this.currentImages = new Array(imagePaths.length).fill(null);
  }

  // Load a single image by index, returning a Promise
  static async loadImage(index) {
    if (this.currentImages[index]) {
      // Already loaded, return existing URL
      return this.currentImages[index];
    }

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

    // Cancel any pending auto-transition
    if (this.autoTransitionTimeoutId) {
      clearTimeout(this.autoTransitionTimeoutId);
      this.autoTransitionTimeoutId = null;
    }

    // Remove old image
    const oldImg = this.container.querySelector('img');
    if (oldImg) {
      oldImg.remove();
    }

    // Show loading indicator if you want here (optional)...

    // Load image (either already loaded or decrypt now)
    let imgSrc = this.currentImages[index];
    if (!imgSrc) {
      imgSrc = await this.loadImage(index);
    }

    if (!imgSrc) {
      // Show fallback or error image
      console.warn(`Image at index ${index} not available.`);
      return;
    }

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Image ${index + 1}`;
    this.container.insertBefore(img, this.container.firstChild);

    // No blocking on load; image will appear when ready
    img.onload = () => {
      // Image loaded, you can log or update UI if needed
      console.log(`Image ${index + 1} loaded.`);
    };
  }

  static close() {
    this.container.style.display = "none";

    // Revoke object URLs to free memory
    this.currentImages.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });

    this.currentImages = [];
    this.imagePaths = [];
    this.currentFolder = null;
    this.currentIndex = 0;
    this.autoTransition = false;

    // Show card and snow controls again
    document.getElementById("card-wrapper").style.display = "flex";
    if (this.snowControls) this.snowControls.style.display = "";

    // Reset gallery open flag and re-enable card swipe
    this.galleryIsOpen = false;
    window.galleryIsOpen = false;
  }

  // Setup touch events for swipe navigation on mobile
  static setupSwipeHandlers() {
    if (this.touchHandlerSetup) return; // only once
    this.touchHandlerSetup = true;

    let startX = 0;
    let startY = 0;
    let isMoving = false;

    this.container.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isMoving = true;
    }, { passive: true });

    this.container.addEventListener('touchmove', e => {
      if (!isMoving) return;
      // Could add logic here to prevent vertical scroll if you want
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      if (!isMoving) return;
      isMoving = false;

      let endX = e.changedTouches[0].clientX;
      let endY = e.changedTouches[0].clientY;
      let dx = endX - startX;
      let dy = endY - startY;

      // Consider a horizontal swipe if horizontal distance is more than vertical and > 30px
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        if (dx > 0) {
          this.showImage(this.currentIndex - 1);
        } else {
          this.showImage(this.currentIndex + 1);
        }
      }
    }, { passive: true });
  }
}
