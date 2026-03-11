/**
 * Decap CMS Content Renderer
 * Dynamically loads and renders content from JSON files
 */

class ContentRenderer {
  constructor(contentFile) {
    this.contentFile = contentFile;
    this.content = null;
  }

  async init() {
    try {
      const response = await fetch(this.contentFile);
      if (!response.ok) throw new Error(`Failed to load ${this.contentFile}`);
      this.content = await response.json();
      return this;
    } catch (error) {
      console.error('Error loading content:', error);
      return null;
    }
  }

  renderSections(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.content || !this.content.sections) {
      console.error('Container not found or no sections to render');
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Render each section
    this.content.sections.forEach(section => {
      const sectionElement = this.renderSection(section);
      if (sectionElement) {
        container.appendChild(sectionElement);
      }
    });
  }

  renderSection(section) {
    switch (section.type) {
      case 'hero':
        return this.renderHeroSection(section);
      case 'text':
        return this.renderTextSection(section);
      case 'image':
        return this.renderImageSection(section);
      case 'two-column':
        return this.renderTwoColumnSection(section);
      case 'quote':
        return this.renderQuoteSection(section);
      case 'programs':
        return this.renderProgramsSection(section);
      case 'contact':
        return this.renderContactSection(section);
      case 'donation-options':
        return this.renderDonationOptionsSection(section);
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  }

  renderHeroSection(section) {
    const heroSection = document.createElement('section');
    
    // Determine if this is the about page hero or home page hero
    if (section.videoUrl) {
      // Home page hero with video
      heroSection.className = 'hero';
      heroSection.innerHTML = `
        <video autoplay muted loop playsinline class="hero-video">
          <source src="${section.videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>${this.escapeHtml(section.title)}</h1>
          <p>${this.escapeHtml(section.subtitle)}</p>
        </div>
      `;
    } else {
      // About page hero
      heroSection.className = 'about-hero';
      heroSection.innerHTML = `
        <div class="about-hero-overlay"></div>
        <div class="about-hero-content">
          <h1>${this.escapeHtml(section.title)}</h1>
          <p>${this.escapeHtml(section.subtitle)}</p>
        </div>
      `;
    }
    
    return heroSection;
  }

  renderTextSection(section) {
    const textSection = document.createElement('section');
    textSection.className = 'mission';
    textSection.innerHTML = `
      <div class="container">
        <h2>${this.escapeHtml(section.heading)}</h2>
        <p>${this.markdownToHtml(section.content)}</p>
      </div>
    `;
    return textSection;
  }

  renderImageSection(section) {
    const imageSection = document.createElement('section');
    imageSection.className = 'image-section';
    imageSection.innerHTML = `
      <div class="container">
        <img src="${section.image}" alt="${this.escapeHtml(section.alt)}">
        ${section.caption ? `<p class="caption">${this.escapeHtml(section.caption)}</p>` : ''}
      </div>
    `;
    return imageSection;
  }

  renderTwoColumnSection(section) {
    const twoColSection = document.createElement('main');
    twoColSection.className = 'about-wrapper';
    twoColSection.innerHTML = `
      <div class="about-text">
        <h2>${this.escapeHtml(section.heading)}</h2>
        ${this.markdownToHtml(section.textContent)}
      </div>
      <div class="about-image">
        <img src="${section.image}" alt="${this.escapeHtml(section.imageAlt)}">
      </div>
    `;
    return twoColSection;
  }

  renderQuoteSection(section) {
    const quoteSection = document.createElement('section');
    quoteSection.className = 'faith-section';
    quoteSection.innerHTML = `
      <blockquote>
        ${this.escapeHtml(section.quote)}<br>
        <span>— ${this.escapeHtml(section.citation)}</span>
      </blockquote>
    `;
    return quoteSection;
  }

  renderProgramsSection(section) {
    const programsSection = document.createElement('section');
    programsSection.className = 'programs';
    
    const programCards = section.programs.map(program => `
      <div class="carousel-card">
        <h3>${this.escapeHtml(program.title)}</h3>
        <p>${this.escapeHtml(program.description)}</p>
      </div>
    `).join('');

    programsSection.innerHTML = `
      <div class="container">
        <h2>${this.escapeHtml(section.heading)}</h2>
        <div class="carousel-container">
          <div class="carousel" id="program-carousel">
            ${programCards}
          </div>
        </div>
      </div>
    `;
    return programsSection;
  }

  renderContactSection(section) {
    const contactSection = document.createElement('section');
    contactSection.className = 'contact-section';
    contactSection.innerHTML = `
      <div class="container">
        <h1>${this.escapeHtml(section.heading)}</h1>
        <p>${this.escapeHtml(section.subtitle)}</p>

        <div class="contact-cards">
          <!-- Form Card -->
          <div class="contact-card">
            <form id="contactForm" class="contact-form" action="#" method="post" novalidate>
              <label for="name">Your Name</label>
              <input id="name" name="name" type="text" required>

              <label for="email">Email</label>
              <input id="email" name="email" type="email" required>

              <label for="message">Message</label>
              <textarea id="message" name="message" rows="6" required></textarea>

              <button type="submit" class="btn primary">Send Message</button>
              <p id="formStatus" class="form-status" aria-live="polite"></p>
            </form>
          </div>

          <!-- Contact Info Card -->
          <div class="contact-card">
            <h2>Visit or Call</h2>
            <p><strong>Address:</strong> ${this.escapeHtml(section.address)}</p>
            <p><strong>Phone:</strong> ${this.escapeHtml(section.phone)}</p>
            <p><strong>Email:</strong> ${this.escapeHtml(section.email)}</p>
          </div>
        </div>
      </div>
    `;
    return contactSection;
  }

  renderDonationOptionsSection(section) {
    const donationSection = document.createElement('section');
    donationSection.className = 'donation-options';
    
    const optionCards = section.options.map(option => `
      <div class="card">
        <h3>${this.escapeHtml(option.title)}</h3>
        <p>${this.escapeHtml(option.description)}</p>
        <a class="btn ${option.buttonText.toLowerCase().includes('contact') ? 'ghost' : 'primary'}" href="${option.buttonLink}">${this.escapeHtml(option.buttonText)}</a>
      </div>
    `).join('');

    donationSection.innerHTML = `
      <h2>${this.escapeHtml(section.heading)}</h2>
      <div class="grid three">
        ${optionCards}
      </div>
    `;
    return donationSection;
  }

  // Helper function to escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Simple markdown to HTML converter (basic implementation)
  markdownToHtml(markdown) {
    if (!markdown) return '';
    
    // Convert newlines to paragraphs
    const paragraphs = markdown.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${this.escapeHtml(p.trim())}</p>`).join('');
  }
}

// Gallery Renderer
class GalleryRenderer {
  constructor(contentFile) {
    this.contentFile = contentFile;
    this.content = null;
  }

  async init() {
    try {
      const response = await fetch(this.contentFile);
      if (!response.ok) throw new Error(`Failed to load ${this.contentFile}`);
      this.content = await response.json();
      return this;
    } catch (error) {
      console.error('Error loading gallery:', error);
      return null;
    }
  }

  renderGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.content || !this.content.images) {
      console.error('Container not found or no images to render');
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Add title and subtitle
    const header = document.createElement('div');
    header.innerHTML = `
      <h1>${this.escapeHtml(this.content.title)}</h1>
      <p>${this.escapeHtml(this.content.subtitle)}</p>
    `;
    container.appendChild(header);

    // Create carousel
    const carouselRow = document.createElement('div');
    carouselRow.className = 'carousel-row';
    
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    carousel.id = 'program-carousel';

    this.content.images.forEach(image => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML = `
        <img src="${image.image}" alt="${this.escapeHtml(image.caption)}">
      `;
      carousel.appendChild(card);
    });

    carouselRow.appendChild(carousel);
    container.appendChild(carouselRow);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Auto-initialize based on page
document.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  let contentFile = '';
  let containerId = 'content-container';

  // Determine which content file to load
  if (page === 'index.html' || page === '') {
    contentFile = 'content/home.json';
  } else if (page === 'about.html') {
    contentFile = 'content/about.json';
  } else if (page === 'contact.html') {
    contentFile = 'content/contact.json';
  } else if (page === 'donate.html') {
    contentFile = 'content/donate.json';
    containerId = 'donate-content';
  } else if (page === 'gallery.html') {
    // Gallery uses special renderer
    const galleryRenderer = await new GalleryRenderer('content/gallery.json').init();
    if (galleryRenderer) {
      galleryRenderer.renderGallery('gallery-content');
    }
    return;
  }

  // Render standard pages
  if (contentFile) {
    const renderer = await new ContentRenderer(contentFile).init();
    if (renderer) {
      renderer.renderSections(containerId);
    }
  }
});

// Footer year update
document.addEventListener('DOMContentLoaded', () => {
  const yearElements = document.querySelectorAll('#year, #yearDonate');
  yearElements.forEach(el => {
    if (el) el.textContent = new Date().getFullYear();
  });
});