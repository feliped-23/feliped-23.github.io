/* 
=======================================
  Contact Form Handler
  Felipe Diaz Website
=======================================
*/

/**
 * Contact form → mailto: handler (no backend)
 */
export const initContactForm = () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("name")?.value || "").trim();
    const fromEmail = (document.getElementById("email")?.value || "").trim();
    const subject = (document.getElementById("subject")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    const to = "felipeandres2304@gmail.com";
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${fromEmail}\n\n${message}`);
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
  });
};
