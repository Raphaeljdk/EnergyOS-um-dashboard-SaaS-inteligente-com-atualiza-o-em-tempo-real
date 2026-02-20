import { $, addClass, removeClass } from "/js/core/dom.js";

export function initNavbar(options = {}) {
  const {
    selector = "header",
    offset = 20,
    className = "scrolled"
  } = options;

  const header = $(selector);
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleScroll() {
    if (window.scrollY > offset) {
      addClass(header, className);
    } else {
      removeClass(header, className);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Executa uma vez ao iniciar
  handleScroll();

  // Retorna função para cleanup (importante para SPA)
  return function destroy() {
    window.removeEventListener("scroll", onScroll);
  };
}
const toggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
