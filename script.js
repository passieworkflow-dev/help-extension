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

const sidebar = document.getElementById('sidebar')

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

  //Function to show phone nuber in click (in the ASAP area)
  function showPhoneNumber() {
    document.getElementById('phone-display') .style.display = 'block';
    alert('Phone number revealed below. Call during business hours for urgent issues.');
  }

 //Function to load and display events. owner can add events what the users can see ( for testing or testfitting )
  function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const now = new Date();
    const filteredEvents = events.filter(event => new Date(event.date) >= now); //Auto-delete past events
    localStorage.setItem('events', JSON.stringify(filteredEvents));             // Save filtered list

    const list = document.getElementById('events-list');
    list.innerHTML = '';
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((event, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${event.date}</strong>: ${event.title} at ${event.location} <button class="delete-event" data-index="${index}">Delete</button>`;
      list.appendChild(li);
    });
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
    if (e.target && e.target.classList && e.target.classList.contains('external-link-btn')) {
      let count = parseInt(localStorage.getItem('clickCount-external-links') || '0');
      count++;
      localStorage.setItem('clickCount-external-links', count);
      console.log(`External link clicked. Total clicks: ${count}`);
  }

    if (e.target && e.target.classList && e.target.classList.contains('delete-event')) {
    const index = e.target.getAttribute('data-index');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
    }
  });

 
  //Event handler
  document.getElementById('add-event-btn').addEventListener('click', () => {
    const date = document.getElementById('event-date').value;
    const title = document.getElementById('event-title').value;
    const location = document.getElementById('event-location').value;
    if (date && title && location) {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      events.push({ date, title, location });
      localStorage.setItem('events', JSON.stringify(events));
      loadEvents(); // Refresh list
      //Clear form
      document.getElementById('event-date').value = '';
      document.getElementById('event-title').value = '';
      document.getElementById('event-location').value = '';
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

  document.getElementById('teaming-up-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const option = document.querySelector('input[name="option-team-up"]:checked').value;
    const details = document.getElementById('teaming-up').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phoneNumber').value;
    console.log('Teaming-up submission:', { option, details, name, email, phone });
    alert('Thank You! Your message has been sent.');
    document.getElementById('response-teaming-up').style.display = 'block';
    document.getElementById('teaming-up-form').reset();
  });
  
  document.getElementById('teaming-sponsor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sponsorType = document.querySelector('input[name="option-teaming-sponsor"]:checked').value || 'None selected';
    const userName = document.getElementById('sponsor-user-name').value;      //user details
    const userEmail = document.getElementById('sponsor-user-email').value;
    const userPhone = document.getElementById('sponsor-user-phoneNumber').value;
    const eventName = document.getElementById('sponsor-event-name').value;      //event details
    const eventEmail = document.getElementById('sponsor-event-email').value;
    const eventPhone = document.getElementById('sponsor-event-phoneNumber').value;
    const details = document.getElementById('sponsor-details').value;
    
    console.log('Sponsoring submission:', { sponsorType, userName, userPhone, evnetName, eventEmail, eventPhone, details });
    alert('Thank You! Your sponsoring proposal has been sent.');
    document.getElementById('response-teaming-sponsor').style.display = 'block';
    document.getElementById('teaming-sponsor-form').reset();
  });

  document.getElementById('problem-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const product = document.getElementById('problem-product').value;
    const name = document.getElementById('problem-user-name').value;
    const email = document.getElementById('problem-email').value;
    console.log('Problem report:', { product, name, email });
    alert('Thank you! Your problem report has been submitted.');
    document.getElementById('response-problem').style.display = 'block';
    document.getElementById('problem-contact-form').reset();
  });
                

  // Load events on page load
    loadEvents();


  // Initial language update
  updateLanguage();
});
