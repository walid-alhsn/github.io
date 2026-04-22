const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('portfolio-theme', currentTheme);
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach((item, index) => {
  const header = item.querySelector('.accordion-header');
  const body = item.querySelector('.accordion-body');

  if (index === 0) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    accordionItems.forEach(otherItem => {
      otherItem.classList.remove('open');
      otherItem.querySelector('.accordion-body').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

const words = ['Problem Solver', 'Web Developer', 'AI Explorer', 'CS Student'];
const typingText = document.getElementById('typingText');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];

  if (!deleting) {
    typingText.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    typingText.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeLoop, deleting ? 55 : 95);
}

if (typingText) typeLoop();

// ── Supabase config ─────────────────────────────
const SUPABASE_URL  = "https://ocxeokhxbdwhijclkzst.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGVva2h4YmR3aGlqY2xrenN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjU0NTEsImV4cCI6MjA4ODY0MTQ1MX0.fQQQ4huLJqL9Y7Cpog6CgsDiMClr2tLGC-t_9Id0ADE";

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── REAL FORM SUBMISSION ────────────────────────
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const categoryId = formData.get('category');
  const message = formData.get('message')?.toString().trim();

  formMessage.textContent = '';
  formMessage.style.color = '#d14d4d';

  if (!name || !email || !categoryId || !message) {
    formMessage.textContent = 'Please fill in all fields.';
    return;
  }

  if (!isValidEmail(email)) {
    formMessage.textContent = 'Please enter a valid email address.';
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        email,
        message,
        category_id: parseInt(categoryId) //  matches your DB
      })
    });

    if (response.ok) {
      formMessage.textContent = '✓ Message sent! I will be in touch soon.';
      formMessage.style.color = '#1A7A4A';
      contactForm.reset();
    } else {
      const err = await response.json();
      console.error(err);
      formMessage.textContent = 'Submission failed. Please try again.';
    }

  } catch (error) {
    console.error(error);
    formMessage.textContent = 'Network error. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '✈ Send Message';
  }
});