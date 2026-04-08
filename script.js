const revealElements = document.querySelectorAll('.reveal');
const yearElement = document.getElementById('year');

yearElement.textContent = `© ${new Date().getFullYear()} BYzhaoran`;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => observer.observe(element));