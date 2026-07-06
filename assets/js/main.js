document.addEventListener('DOMContentLoaded', function () {
  // Search functionality for listings
  const search = document.getElementById('site-search');
  const listings = Array.from(document.querySelectorAll('.listing'));

  function filterListings(term) {
    const q = term.trim().toLowerCase();
    listings.forEach(card => {
      const title = (card.querySelector('h3') || card.querySelector('h4') || {textContent: ''}).textContent.toLowerCase();
      const desc = (card.querySelector('.desc') || {textContent: ''}).textContent.toLowerCase();
      const meta = (card.querySelector('.price') || {textContent: ''}).textContent.toLowerCase();
      const visible = !q || title.includes(q) || desc.includes(q) || meta.includes(q);
      card.style.display = visible ? '' : 'none';
    });
  }

  if (search) {
    search.addEventListener('input', e => filterListings(e.target.value));
  }

  // Contact form submission with Formspree (or fallback instruction)
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {
        statusEl.textContent = 'Sustituye YOUR_FORM_ID en el atributo "action" por tu endpoint de Formspree (ver SITE_README).';
        statusEl.className = 'form-status warning';
        return;
      }

      const data = new FormData(form);
      try {
        const res = await fetch(action, {
          method: form.method || 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          statusEl.textContent = 'Gracias — tu mensaje fue enviado con éxito.';
          statusEl.className = 'form-status success';
          form.reset();
        } else {
          const json = await res.json().catch(()=>null);
          statusEl.textContent = (json && json.error) ? json.error : 'Ocurrió un error al enviar. Intenta de nuevo más tarde.';
          statusEl.className = 'form-status error';
        }
      } catch (err) {
        statusEl.textContent = 'No se pudo conectar con el servicio. Revisa tu conexión o el endpoint.';
        statusEl.className = 'form-status error';
      }
    });
  }
});
