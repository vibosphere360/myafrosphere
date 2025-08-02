// scripts.js

// Cookie Consent
function initAnalytics() {
    // Placeholder for GA4 or Plausible
    console.log("Analytics initialized");
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').style.display = 'none';
    initAnalytics();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieBanner').style.display = 'none';
}

function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        document.getElementById('cookieBanner').style.display = 'block';
    } else if (consent === 'accepted') {
        initAnalytics();
    }
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.body.style.overflow = 'hidden';
    if (window.gtag) gtag('event', modalId === 'signinModal' ? 'sign_in_modal_open' : 'signup_modal_open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('signinModal');
    openModal('signupModal');
}

function switchToSignin() {
    closeModal('signupModal');
    openModal('signinModal');
}

// Dynamic Content Loading
function loadCommunities() {
    const container = document.getElementById('communitiesGrid');
    const communities = [
        { emoji: '🇳🇬', name: 'Lagos Tech Hub', location: 'Lagos, Nigeria', desc: 'Join Africa\'s fastest-growing tech community.' },
        { emoji: '🏛️', name: 'Diaspora DC', location: 'Washington D.C.', desc: 'Networking for African professionals in the US.' }
    ];
    container.innerHTML = communities.map(c => `
        <article class="community-card">
            <div class="community-image">${c.emoji}</div>
            <h3 class="community-name">${c.name}</h3>
            <p class="community-location">${c.location}</p>
            <p class="community-description">${c.desc}</p>
        </article>
    `).join('');
}

// Polymorphic Interface
function switchMode(button, mode) {
    document.querySelectorAll('.mode-tab').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const content = document.querySelector('.preview-content');
    const data = {
        forum: { h3: 'Deep Discussions', p: 'Reddit-style conversations with African cultural context.<br>Voice comments, live audio rooms, and expert AMAs.' },
        social: { h3: 'Cultural Sharing', p: 'Instagram meets African storytelling. Share moments, recipes, fashion, and traditions.' },
        network: { h3: 'Professional Network', p: 'LinkedIn for the diaspora. Find mentors, jobs, and business opportunities.' },
        events: { h3: 'Community Events', p: 'Discover and create local meetups, festivals, and professional networking events.' }
    };
    content.innerHTML = `<h3>${data[mode].h3}</h3><p>${data[mode].p}</p>`;
}

// Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkCookieConsent();
    loadCommunities();

    // Close modals on click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => closeModal(modal.id));
        }
    });
});