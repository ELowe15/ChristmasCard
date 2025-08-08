class Gallery {
  static container = document.getElementById('gallery-container');
  static baseEncryptedFolder = 'EncryptedPhotos'; // Add your root path here
  static currentFolder = null;
  static currentImages = [];
  static currentIndex = 0;

  static async open(folder, triggerSong) {
    const fullPath = `${this.baseEncryptedFolder}/${folder}`;
    this.currentFolder = fullPath;
    this.currentIndex = 0;

    await this.loadImages(fullPath);

    document.getElementById("card-wrapper").style.display = "none";
    this.container.style.display = "flex";

    const prevBtn = this.container.querySelector('button.prev');
    const nextBtn = this.container.querySelector('button.next');
    const closeBtn = this.container.querySelector('button.close');

    if (prevBtn) prevBtn.onclick = () => this.showImage(this.currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => this.showImage(this.currentIndex + 1);
    if (closeBtn) closeBtn.onclick = () => this.close();

    // TODO: Handle triggerSong playing & pausing shuffled playlist
  }

  static async loadImages(folder) {
    if (!riddleKey) {
      alert("Decryption key not available. Please enter a valid passphrase.");
      return;
    }

    const imagePaths = await fetchEncryptedList(`${folder}/index.json`, folder);
    if (!imagePaths.length) return;

    const blobUrls = [];
    for (const path of imagePaths) {
      try {
        const blob = await decryptImage(path, riddleKey);
        const url = URL.createObjectURL(blob);
        blobUrls.push(url);
      } catch (err) {
        console.error(`❌ Failed to decrypt ${path}:`, err);
      }
    }

    if (blobUrls.length === 0) {
      alert("No images could be decrypted.");
      return;
    }

    this.currentImages = blobUrls;
    this.showImage(0);
  }

static showImage(index) {
  if (index < 0) index = this.currentImages.length - 1;
  if (index >= this.currentImages.length) index = 0;
  this.currentIndex = index;

  console.log("=== Switching to image index:", index, "===");
  console.log("Image source:", this.currentImages[index]);

  // Log viewport size
  console.log("Viewport size:", window.innerWidth, "x", window.innerHeight);

  const oldImg = this.container.querySelector('img');
  if (oldImg) {
    console.log("Removing old image. Old image size:", oldImg.naturalWidth, "x", oldImg.naturalHeight);
    oldImg.remove();
  }

  const img = document.createElement('img');
  img.src = this.currentImages[index];
  img.alt = `Image ${index + 1}`;
  this.container.insertBefore(img, this.container.firstChild);

  // Container info BEFORE load
  console.log("Container offset size:", this.container.offsetWidth, "x", this.container.offsetHeight);
  console.log("Container client size:", this.container.clientWidth, "x", this.container.clientHeight);

  // Image info BEFORE load
  console.log("Image element created (before load):", {
    width: img.width,
    height: img.height,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    style: window.getComputedStyle(img)
  });

  // After image is fully loaded, print again
  img.onload = () => {
    console.log("Image loaded. Natural size:", img.naturalWidth, "x", img.naturalHeight);
    console.log("Displayed size after load:", img.width, "x", img.height);

    // Container size after load
    console.log("Container size after image load:", this.container.offsetWidth, "x", this.container.offsetHeight);
  };
}

  static close() {
    this.container.style.display = "none";

    // Revoke object URLs to free memory
    this.currentImages.forEach(url => URL.revokeObjectURL(url));

    this.currentImages = [];
    this.currentFolder = null;

    document.getElementById("card-wrapper").style.display = "flex";
  }
}