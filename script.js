let currentLang = 'en'; // Default to English
let path = []; // Track user path

const translations = {
  en: {
    'main-title': 'How can we help you?',
    'btn-order': 'Question about my order',
    'btn-availability': 'Product available',
    'btn-details': 'Product details',
    'btn-delivery': 'Delivery/pick-up',
    'btn-events': 'Upcoming events',
    'btn-teaming': 'Teaming up',
    'btn-contact': 'Direct contact',
    'order-title': 'Questions about my order',
    'availability-title': 'Product availability',
    'details-title': 'Product details',
    'delivery-title': 'Delivery/pick-up',
    'events-title': 'Upcoming events',
    'teaming-title': 'Teaming up',
    'contact-title': 'Direct contact',
    'summary-title': 'Summary',
    'summary-path': 'Your path:',
    'summary-note': 'We\'ll get back to you soon! (Placeholder: In production, this would provide an answer or redirect based on company knowledge.)',
    'email-label': 'Your email:',
    'message-label': 'Additional details:',
    'send-btn': 'Send to Staff'
  },
  nl: {
    'main-title': 'Hoe kunnen we u helpen?',
    'btn-order': 'Vraag over mijn bestelling',
    'btn-availability': 'Product beschikbaar',
    'btn-details': 'Productdetails',
    'btn-delivery': 'Levering/afhalen',
    'btn-events': 'Aankomende evenementen',
    'btn-teaming': 'Samenwerken',
    'btn-contact': 'Direct contact',
    'order-title': 'Vragen over mijn bestelling',
    'availability-title': 'Productbeschikbaarheid',
    'details-title': 'Productdetails',
    'delivery-title': 'Levering/afhalen',
    'events-title': 'Aankomende evenementen',
    'teaming-title': 'Samenwerken',
    'contact-title': 'Direct contact',
    'summary-title': 'Samenvatting',
    'summary-path': 'Uw pad:',
    'summary-note': 'We nemen snel contact met u op! (Placeholder: In productie zou dit een antwoord geven of doorverwijzen op basis van bedrijfs kennis.)',
    'email-label': 'Uw e-mail:',
    'message-label': 'Extra details:',
    'send-btn': 'Verstuur naar personeel'
  }
};

function updateLanguage() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    el.textContent = translations[currentLang][key] || el.textContent;
  });
}

function showLevel(levelId) {
  document.querySelectorAll('.level').forEach(l => l.classList.remove('active'));
  document.getElementById(levelId).classList.add('active');
}

function logPath(step) {
  path.push(step);
  sessionStorage.setItem('helpPath', JSON.stringify(path));
}

document.addEventListener('DOMContentLoaded', () => {
  // Load path from storage
  path = JSON.parse(sessionStorage.getItem('helpPath') || '[]');

  // Language toggle
  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'nl' : 'en';
    updateLanguage();
  });

  // Button navigation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      const next = e.target.getAttribute('data-next');
      const action = e.target.getAttribute('data-action');
      if (next) {
        logPath(e.target.textContent.trim());
        showLevel(next);
      } else if (action === 'summary') {
        logPath(e.target.getAttribute('data-summary'));
        showLevel('level-summary');
        document.getElementById('path-display').textContent = path.join(' > ');
      }
    }
    if (e.target.classList.contains('back-btn')) {
      const back = e.target.getAttribute('data-back');
      if (back) {
        showLevel(back);
      }
    }
    if (e.target.classlistner.contains('external-link-btn')) {                          //Track clicks on external link buttons
      let count = parseInt(localStorage.getItem('clickCount-external-links') || '0');  //Get current count from localStorage (defaut to 0)
      count++;
      localStorage.setItem('clickCount-external-links', count);                       // save back
      console.log(`External link clicked. Total clicks: ${count}`);                   //is optional: log to console
    }
  });

  // Contact form submission
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    // Placeholder: Log to console (replace with API call)
    console.log('Sending to staff:', { path, email, message });
    alert('Thank you! Your message has been sent.'); // Simple feedback
    // Reset path and go back
    path = [];
    sessionStorage.removeItem('helpPath');
    showLevel('level-main');
  });

  // Initial language update
  updateLanguage();
});
