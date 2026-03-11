// Custom JavaScript for Rehema Children's Home

// Contact form handling (if needed)
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formStatus = document.getElementById('formStatus');
      if (formStatus) {
        formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
        formStatus.style.color = 'green';
      }
      
      // Reset form
      contactForm.reset();
    });
  }

  // Navigation toggle for mobile (if needed)
  const navToggle = document.getElementById('navToggleDonate');
  const mainNav = document.getElementById('mainNavDonate');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
});