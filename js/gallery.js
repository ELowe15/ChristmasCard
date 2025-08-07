class Gallery {
  static container = document.getElementById('gallery-container');
  static currentFolder = null;
  static currentImages = [];
  static currentIndex = 0;

  static open(folder, triggerSong) {
    this.currentFolder = folder;
    this.currentIndex = 0;
    this.currentImages = []; // Clear previous gallery images

    // Clear previous content
    this.container.innerHTML = '';

    // Show gallery container
    this.container.classList.remove('hidden');

    // Load first image
    this.loadImages(folder);

    // Controls container
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.onclick = () => this.showImage(this.currentIndex - 1);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => this.showImage(this.currentIndex + 1);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => this.close();

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(closeBtn);

    this.container.appendChild(controls);

    // TODO: Handle triggerSong playing & pausing shuffled playlist

  }

  static async loadImages(folder) {
    // For demonstration, fake image list, replace with real dynamic loading
    this.currentImages = [
      `${folder}/image1.jpg`,
      `${folder}/image2.jpg`,
      `${folder}/image3.jpg`
    ];

    // Show first image immediately
    this.showImage(0);
  }

  static showImage(index) {
    if (index < 0) index = this.currentImages.length - 1;
    if (index >= this.currentImages.length) index = 0;
    this.currentIndex = index;

    // Remove old image
    const oldImg = this.container.querySelector('img');
    if (oldImg) oldImg.remove();

    // Create new image
    const img = document.createElement('img');
    img.src = this.currentImages[index];
    img.alt = `Image ${index + 1}`;
    this.container.insertBefore(img, this.container.firstChild);
  }

  static close() {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
    this.currentImages = [];
    this.currentFolder = null;
  }
}