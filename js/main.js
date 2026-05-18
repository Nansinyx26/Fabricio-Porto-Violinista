// ==========================================================================
// FP VIOLINISTA - SCRIPTS DE INTERAÇÃO BÁSICA
// ==========================================================================

document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    // Abre/fecha menu ao clicar no hambúrguer
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active"); // animação do ícone
    });

    // Fecha o menu quando clica em qualquer link
    const links = navLinks.querySelectorAll("a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }
});
