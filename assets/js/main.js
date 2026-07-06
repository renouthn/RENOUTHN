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

  // validation helpers
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    // simple international-friendly check: digits, spaces, +, -, ()
    return phone.trim() === '' || /^[-+() 0-9]{6,20}$/.test(phone);
  }

  function showFieldError(el, msg) {
    let next = el.nextElementSibling;
    if (!next || !next.classList || !next.classList.contains('field-error')) {
      next = document.createElement('div');
      next.className = 'field-error';
      el.parentNode.insertBefore(next, el.nextSibling);
    }
    next.textContent = msg;
  }
  function clearFieldErrors(formEl) {
    Array.from(formEl.querySelectorAll('.field-error')).forEach(n => n.remove());
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      clearFieldErrors(form);

      const name = (form.querySelector('input[name="name"]') || {}).value || '';
      const email = (form.querySelector('input[name="email"]') || {}).value || '';
      const phone = (form.querySelector('input[name="phone"]') || {}).value || '';
      const message = (form.querySelector('textarea[name="message"]') || {}).value || '';

      let hasError = false;
      if (name.trim().length < 2) { hasError = true; showFieldError(form.querySelector('input[name="name"]'), 'Indica tu nombre (mínimo 2 caracteres)'); }
      if (!validateEmail(email)) { hasError = true; showFieldError(form.querySelector('input[name="email"]'), 'Correo inválido'); }
      if (!validatePhone(phone)) { hasError = true; showFieldError(form.querySelector('input[name="phone"]'), 'Teléfono inválido'); }
      if (message.trim().length < 10) { hasError = true; showFieldError(form.querySelector('textarea[name="message"]'), 'Mensaje muy corto (mínimo 10 caracteres)'); }
      if (hasError) { statusEl.textContent = 'Corrige los errores del formulario.'; statusEl.className = 'form-status error'; return; }

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

          // optional: forward to Google Sheets endpoint
          const sheetEndpoint = form.getAttribute('data-sheet-endpoint') || '';
          if (sheetEndpoint) {
            try {
              await fetch(sheetEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, message, date: new Date().toISOString() })
              });
            } catch (err) {
              console.warn('Error forwarding to sheet endpoint', err);
            }
          }

          // optional: forward to email webhook
          const emailEndpoint = form.getAttribute('data-email-endpoint') || '';
          if (emailEndpoint) {
            try {
              await fetch(emailEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, message })
              });
            } catch (err) {
              console.warn('Error forwarding to email endpoint', err);
            }
          }
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

  // WhatsApp button click tracking (Google Analytics / gtag / dataLayer)
  const waBtn = document.getElementById('whatsappButton');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      try {
        if (typeof gtag === 'function') {
          gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'whatsapp_button' });
        } else if (typeof ga === 'function') {
          ga('send', 'event', 'engagement', 'whatsapp_click');
        } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
          window.dataLayer.push({ event: 'whatsapp_click', category: 'engagement', label: 'whatsapp_button' });
        }
      } catch (err) {
        console.warn('Analytics tracking failed', err);
      }
    });
  }
});
