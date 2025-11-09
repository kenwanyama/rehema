document.addEventListener('DOMContentLoaded', function () {
  // Set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ========================
  // Programs Horizontal Carousel (Amazon-style)
  // ========================
  const carousel = document.getElementById("program-carousel");
  if (carousel) {
    // Duplicate for seamless scroll
    carousel.innerHTML += carousel.innerHTML;
    let scrollPos = 0;
    const baseSpeed = 0.5;
    let speed = baseSpeed;

    function slide() {
      scrollPos += speed;
      if (scrollPos >= carousel.scrollWidth / 2) scrollPos = 0;
      carousel.scrollLeft = scrollPos;
      requestAnimationFrame(slide);
    }

    slide();

    // Hover to reverse direction
    carousel.addEventListener("mousemove", (e) => {
      const rect = carousel.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const middle = rect.width / 2;
      

      speed = baseSpeed + (mouseX - middle) / middle * 1.5;
      
    });

    carousel.addEventListener("mouseleave", () => {
      speed = baseSpeed;
    });
  }
});
